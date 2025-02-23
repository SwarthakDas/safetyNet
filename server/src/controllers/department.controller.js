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
    const {email, departmentname,adminname, password, latitude, longitude}=req.body
    console.log("email: ",email);
   if(
    [adminname, email, departmentname, password].some((filed)=>filed?.trim()==="")
   ){
    throw new ApiError(400,"All fields are required")
   }
   if(!latitude || !longitude){
    throw new ApiError(400,"Location access required")
   }
   const existerDepartment=await Department.findOne({
    $or: [{ departmentname: departmentname.toLowerCase() }, {email}]
   })
   if(existerDepartment){
    throw new ApiError(409, "Department with email or Departmentname already exited")
   }
   
   const newDepartment=await Department.create({
    departmentname:departmentname.toLowerCase(),
    email,
    password,
    adminname,
    location:{
        latitude:latitude||"",
        longitude:longitude||""
    } 
  })
  if(!newDepartment){
    throw new ApiError(500, "Something went wrong while creating Department")
   }
   return res.status(201).json(
    new ApiResponse(200, newDepartment, "Department registered Successfully")
   )
})

const loginDepartment = asyncHandler(async (req, res) => {
  const { email, password, latitude, longitude } = req.body;

  if (!email) {
      throw new ApiError(400, "Department name or Email required");
  }

  const department = await Department.findOne({
      $or: [{ email }],
  });

  if (!department) {
      throw new ApiError(404, "Department does not exist");
  }

  const isPasswordValid = await department.isPasswordCorrect(password);
  if (!isPasswordValid) {
      throw new ApiError(401, "Invalid Department credentials");
  }

  if (latitude && longitude) {
      department.location.latitude = latitude;
      department.location.longitude = longitude;
      await department.save();
  }

  const accessToken = department.generateAccessToken();
  const refreshToken = department.generateRefreshToken();

  department.refreshToken = refreshToken;
  await department.save();

  const loggedInDepartment = await Department.findById(department._id).select("-password -refreshToken");

  const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
  };

  return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
          new ApiResponse(
              200,
              { department: loggedInDepartment, accessToken, refreshToken },
              "Department logged in successfully"
          )
      );
});

const logoutDepartment = asyncHandler(async (req, res) => {
  if (!req.department) {
    throw new ApiError(401, "Unauthorized request: Department not found");
  }

  await Department.findByIdAndUpdate(
    req.department._id,  // ✅ Corrected reference
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Department logged out successfully"));
});

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
