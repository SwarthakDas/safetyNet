import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Complain } from "../models/complain.model";
import { uploaOnCloudinary } from "../utils/Cloudinary";

const fileComplain=asyncHandler(async(req,res)=>{
    const{complain,raisedBy,status,department}=req.body
    if(!complain && !raisedBy){
        throw new ApiError(400,"Error creating Complain")
    }
    const existedcomplain=Complain.findOne({
        $and:[{complain},{raisedBy}]
    })
    if(existedcomplain){
        throw new ApiError(409,"Complain already exists")
    }
    const complainImageLocalPath=req.files?.complainImage[0]?.complainImageLocalPath
    if(!complainImageLocalPath){
        throw new ApiError(400,"Complain Image required")
    }
    const complainImage=await uploaOnCloudinary(complainImageLocalPath)
    if(!complainImage){
        throw new ApiError(4400,"Complain Image is required")
    }
    const newComplain=await Complain.create({
        complain,
        raisedBy,
        department,
        status,
        createdAt:new Date(),
        complainImage:complainImage.url
    })
    if(!newComplain){
        throw new ApiError(400,"Error while creating new Complain")
    } 
    res.status(201).json(
        new ApiResponse(201, newComplain, "New Complain lodged successfully")
    )
})

const updateComplain=asyncHandler(async(req,res)=>{

})