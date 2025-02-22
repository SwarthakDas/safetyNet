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
        enum:["pending","accepted","resolved","rejected"],
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
    complaintImage:{
        type:String //cloudinary url
    }
})

export const Complaint=mongoose.model("Complaint",complaintSchema);