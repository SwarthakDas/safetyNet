import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Emergency } from "../models/emergency.model";

const Emergency=asyncHandler(async(req,res)=>{
    const {requestType,status,description}=req.body
    const {raisedBy}=req.params;
    if(
        [raisedBy,requestDept,status,description].some((filed)=>filed?.trim()==="")
       ){
        throw new ApiError(400,"All fields are required")
    }
    const existedEmergency=await Emergency.findOne({
        $or:[{requestType},{requestDept}]
    })
    if(existedEmergency){
        throw new ApiError(400,"Emergency Already Exists")
    }
    const emergency=await Emergency.create({
        raisedBy,
        requestType,
        status:status || "",
        description,
        createdAt:new Date()
    })
    const createdEmergency=await Emergency.findById(emergency._id)
    if(!createdEmergency){
        throw new ApiError(500,"Soemthing went wrong while creating Emergency")
    }
    return res.status(201).json(
        new ApiResponse(200,createdEmergency,"Emergency Created Successfully")
    )
})

const updateEmergency=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const {currstatus}=req.body;
    const emergencyid=Emergency.findById(id)
    if(!emergencyid){
        throw new ApiError(404,"No such emergency exists")
    }
    const updated_emergency=await Emergency.findByIdAndUpdate(
        id,
        {
            $set:{
                status:currstatus
            }
        },{new:true}
    )
    if(!updated_emergency){
        throw new ApiError(400,"Error while updating emergency")
    }
    return res.status(200).json(
        new ApiResponse(200,updated_emergency,"Emergency Successfully Updated")
    )
})

const getRequest=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const emergency=findById(id)
    if(!emergency){
        throw new ApiError(404,"Emergency request not found")
    }
    res.status(200).json(
        new ApiResponse(200,emergency,"Emergency fetched successfully")
    )
})