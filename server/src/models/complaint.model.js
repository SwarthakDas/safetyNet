import mongoose,{Schema} from "mongoose";

const complaintSchema=new Schema({
    complaint:{
        type:String,
        required:true,

    },
    raisedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true
    },
    lastupdated:{
        type:Date,
        required:true
    }
})

export const Complaint=mongoose.model("Complaint",complaintSchema);