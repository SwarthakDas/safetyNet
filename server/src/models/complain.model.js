import mongoose,{Schema} from "mongoose";

const complaintSchema=new Schema({
    complain:{
        type:String,
        required:true,
    },
    raisedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
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
    },
    complainImage:{
        type:String //cloudinary url
    }
})

export const Complain=mongoose.model("Complaint",complaintSchema);