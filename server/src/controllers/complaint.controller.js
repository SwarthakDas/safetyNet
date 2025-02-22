import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploaOnCloudinary } from "../utils/Cloudinary.js";
import { Complaint } from "../models/complain.model.js";

const filecomplaint=asyncHandler(async(req,res)=>{
    const{complaint,raisedBy,status}=req.body
    if(!complaint && !raisedBy){
        throw new ApiError(400,"Error creating complaint")
    }
    const existedcomplaint=complaint.findOne({
        $and:[{complaint},{raisedBy}]
    })
    if(existedcomplaint){
        throw new ApiError(409,"complaint already exists")
    }
    const complaintImageLocalPath=req.files?.complaintImage[0]?.complaintImageLocalPath
    if(!complaintImageLocalPath){
        throw new ApiError(400,"complaint Image required")
    }
    const complaintImage=await uploaOnCloudinary(complaintImageLocalPath)
    if(!complaintImage){
        throw new ApiError(400,"complaint Image is required")
    }
    const newcomplaint=await complaint.create({
        complaint,
        raisedBy,
        status,
        createdAt:new Date(),
        complaintImage:complaintImage.url
    })
    if(!newcomplaint){
        throw new ApiError(400,"Error while creating new complaint")
    } 
    res.status(201).json(
        new ApiResponse(201, newcomplaint, "New complaint lodged successfully")
    )
})

const updatecomplaint=asyncHandler(async(req,res)=>{
    const {id}=req.params;
        const {currstatus}=req.body;
        const complaintid=await complaint.findById(id)
        if(!complaintid){
            throw new ApiError(404,"No such complaint exists")
        }
        const updated_complaint=await complaint.findByIdAndUpdate(
            id,
            {
                $set:{
                    status:currstatus
                }
            },{new:true}
        )
        if(!updated_complaint){
            throw new ApiError(400,"Error while updating complaint")
        }
        return res.status(200).json(
            new ApiResponse(200,updated_complaint,"complaint Successfully Updated")
        )
})

const getcomplaint=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const complaintId=await findById(id)
    if(!complaintId){
        throw new ApiError(404,"complaint request not found")
    }
    res.status(200).json(
        new ApiResponse(200,complaint,"complaint fetched successfully")
    )
})

const getPendingcomplaints = asyncHandler(async (req, res) => {
    const pendingcomplaints = await Complaint.find({status:"pending"})
    if(!pendingcomplaints){
        throw new ApiError(404,"There are no pending Complaits found")
    }
    res.status(200).json(new ApiResponse(200, pendingcomplaints, "Pending complaintts fetched successfully"));
});

const getNonPendingComplaints = asyncHandler(async (req, res) => {
    const nonPendingComplaints = await Complaint.find({ status: { $ne: "pending" } });
    if(!nonPendingComplaints){
        throw new ApiError(404,"No non pending complaints found")
    }
    res.status(200).json(new ApiResponse(200, nonPendingComplaints, "Non-pending complaints fetched successfully"));
});

export {
    filecomplaint,
    updatecomplaint,
    getcomplaint,
    getPendingcomplaints,
    getNonPendingComplaints
}