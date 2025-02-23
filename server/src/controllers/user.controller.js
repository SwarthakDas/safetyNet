import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshTokenUser=async(userID)=>{
  try {
    const user=await User.findById(userID)
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()

    user.refreshToken=refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken, refreshToken}
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
} 

const registerUser=asyncHandler(async (req, res)=>{
    const {firstname,lastname, email, username, password, latitude, longitude}=req.body
    console.log("email: ",email);
   if(
    [firstname,lastname, email, username, password].some((filed)=>filed?.trim()==="")
   ){
    throw new ApiError(400,"All fields are required")
   }
   if(!latitude || !longitude){
    throw new ApiError(400,"Location access required")
   }
   const existerUser=await User.findOne({
    $or: [{username}, {email}]
   })
   if(existerUser){
    throw new ApiError(409, "User with email or username already exited")
   }
   
   const user=await User.create({
        username:username.toLowerCase(),
        email,
        firstname,
        lastname,
        password,
        location:{
            latitude:latitude||"",
            longitude:longitude||""
        } 
   })

   const createdUser=await User.findById(user._id).select("-password -refreshToken")
   if(!createdUser){
    throw new ApiError(500, "Something went wrong while creating user")
   }

   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
   )
})

const loginUser=asyncHandler(async(req,res)=>{
  const {email, username, password, latitude, longitude}= req.body

  if(!username || !email){
    throw new ApiError(400,"Username or Email required")
  }
  
  const user=await User.findOne({
    $or: [{username}, {email}]
  })
  if(!user){
    throw new ApiError(404, "User does not exist")
  }

  await User.findByIdAndUpdate(
    user._id,
    {
        $set: { 
            "location.latitude": latitude, 
            "location.longitude": longitude 
        }
    },
    { new: true, runValidators: true }
  );
  const isPasswordValid=await user.isPasswordCorrect(password)
  if(!isPasswordValid){
    throw new ApiError(401, "Invalid user credentials")
  }

  const {accessToken, refreshToken}= await generateAccessAndRefreshTokenUser(user._id)

  const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

  const options={
    httpOnly: true,
    secure: true
  }

  return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      {
        user: loggedInUser, accessToken, refreshToken
      },
      "user logged in succesfully"
    )
  )
})

const logoutUser=asyncHandler(async(req, res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )
  const options={
    httpOnly: true,
    secure: true
  }
  
  return res.status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200,{},"User logged out successfully"))
})

const refreshAccessTokenUser=asyncHandler(async(req, res)=>{
  const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken//what is this req.body.refreshtoken?
  if(!incomingRefreshToken){
    throw new ApiError(401, "Unauthorized request")
  }
  try {
    const decodedToken=jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET_USER
    )
  
    const user=await User.findById(decodedToken?._id)
    if(!user){
      throw new ApiError(401, "Invalid refresh token")
    }
    if(incomingRefreshToken!==user?.refreshToken){
      throw new ApiError(401, "Refresh token is expired or used")
    }
    const options={
      httpOnly: true,
      secure: true
    }
    const {accessToken, newRefreshToken}=await generateAccessAndRefreshTokenUser(user._id)
  
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken,options)
    .json(
      new ApiResponse(
        200,{accessToken, refreshToken: newRefreshToken},
        "Access token refreshed"
      )
    )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }
})

const changeCurrentPasswordUser=asyncHandler(async(req,res)=>{
  const{oldPassword, newPassword}=req.body
  const user=await User.findById(req.user?._id)
  const isPasswordCorrent=await user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrent){
    throw new ApiError(400,"Invalid Old password")
  }

  user.password=newPassword
  await user.save({validateBeforeSave: false})
  return res.status(200)
  .json(new ApiResponse(200,{},"Password Saved Succesfully"))
})

const getCurrentUser=asyncHandler(async(req,res)=>{
  return res.status(200)
  .json(new ApiResponse(200, req.user, "Current User fetched successfully"))
})

const updateAccountDetails=asyncHandler(async(req,res)=>{
  const{fullName, email}=req.body
  if(!fullName||!email){
    throw new ApiError(400,"All fields are required")
  }

  const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        fullName:fullName,
        email:email
      }
    },
    {new:true}
  ).select("-passoword")

  return res.status(200)
  .json(new ApiResponse(200,user,"Account Details Updated Successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    refreshAccessTokenUser,
    changeCurrentPasswordUser
}