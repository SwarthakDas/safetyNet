import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { Department } from "../models/department.model.js";

const generateAccessAndRefreshTokenDept=async(DepartmentID)=>{
  try {
    const Department=await Department.findById(DepartmentID)
    const accessToken=Department.generateAccessToken()
    const refreshToken=Department.generateRefreshToken()

    Department.refreshToken=refreshToken
    await Department.save({validateBeforeSave: false})

    return {accessToken, refreshToken}
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
} 

const registerDepartment=asyncHandler(async (req, res)=>{
    const {fullname, email, Departmentname, password, latitude, longitude}=req.body
    console.log("email: ",email);
   if(
    [fullname, email, Departmentname, password].some((filed)=>filed?.trim()==="")
   ){
    throw new ApiError(400,"All fields are required")
   }
   if(!latitude || !longitude){
    throw new ApiError(400,"Location access required")
   }
   const existerDepartment=await Department.findOne({
    $or: [{Departmentname}, {email}]
   })
   if(existerDepartment){
    throw new ApiError(409, "Department with email or Departmentname already exited")
   }
   
   const Department=await Department.create({
        Departmentname:Departmentname.toLowerCase(),
        email,
        firstname,
        lastname,
        password,
        location:{
            latitude:latitude||"",
            longitude:longitude||""
        } 
   })

   const createdDepartment=await Department.findById(Department._id).select("-password -refreshToken")
   if(!createdDepartment){
    throw new ApiError(500, "Something went wrong while creating Department")
   }

   return res.status(201).json(
    new ApiResponse(200, createdDepartment, "Department registered Successfully")
   )
})

const loginDepartment=asyncHandler(async(req,res)=>{
  const {email, Departmentname, password, latitude, longitude}= req.body

  if(!Departmentname && !email){
    throw new ApiError(400,"Departmentname or Email required")
  }
  
  const Department=await Department.findOne({
    $or: [{Departmentname}, {email}]
  })
  if(!Department){
    throw new ApiError(404, "Department does not exist")
  }

  await Department.findByIdAndUpdate(
    Department._id,
    {
        $set: { 
            "location.latitude": latitude, 
            "location.longitude": longitude 
        }
    },
    { new: true, runValidators: true }
  );
  const isPasswordValid=await Department.isPasswordCorrect(password)
  if(!isPasswordValid){
    throw new ApiError(401, "Invalid Department credentials")
  }

  const {accessToken, refreshToken}= await generateAccessAndRefreshTokenDept(Department._id)

  const loggedInDepartment=await Department.findById(Department._id).select("-password -refreshToken")

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
        Department: loggedInDepartment, accessToken, refreshToken
      },
      "Department logged in succesfully"
    )
  )
})

const logoutDepartment=asyncHandler(async(req, res)=>{
  await Department.findByIdAndUpdate(
    req.Department._id,
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
  .json(new ApiResponse(200,{},"Department logged out successfully"))
})

const refreshAccessTokendept=asyncHandler(async(req, res)=>{
  const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken//what is this req.body.refreshtoken?
  if(!incomingRefreshToken){
    throw new ApiError(401, "Unauthorized request")
  }
  try {
    const decodedToken=jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
  
    const Department=await Department.findById(decodedToken?._id)
    if(!Department){
      throw new ApiError(401, "Invalid refresh token")
    }
    if(incomingRefreshToken!==Department?.refreshToken){
      throw new ApiError(401, "Refresh token is expired or used")
    }
    const options={
      httpOnly: true,
      secure: true
    }
    const {accessToken, newRefreshToken}=await generateAccessAndRefreshToken(Department._id)
  
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

const changeCurrentPassworddept=asyncHandler(async(req,res)=>{
  const{oldPassword, newPassword}=req.body
  const Department=await Department.findById(req.Department?._id)
  const isPasswordCorrent=await Department.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect){
    throw new ApiError(400,"Invalid Old password")
  }

  Department.password=newPassword
  await Department.save({validateBeforeSave: false})
  return res.status(200)
  .json(new ApiResponse(200,{},"Password Saved Succesfully"))
})

const getCurrentDepartment=asyncHandler(async(req,res)=>{
  return res.status(200)
  .json(new ApiResponse(200, req.Department, "Current Department fetched successfully"))
})

const updateAccountDetailsdept=asyncHandler(async(req,res)=>{
  const{fullName, email}=req.body
  if(!fullName||!email){
    throw new ApiError(400,"All fields are required")
  }

  const Department=await Department.findByIdAndUpdate(
    req.Department?._id,
    {
      $set:{
        fullName:fullName,
        email:email
      }
    },
    {new:true}
  ).select("-passoword")

  return res.status(200)
  .json(new ApiResponse(200,Department,"Account Details Updated Successfully"))
})

export {
    registerDepartment,
    loginDepartment,
    logoutDepartment,
    refreshAccessTokendept,
    changeCurrentPassworddept,
    getCurrentDepartment,
    updateAccountDetailsdept
}
