import mongoose,{Mongoose, Schema} from "mongoose";

const emergencySchema=new Schema(
    {
        raisedBy:{
            type:Schema.Types.ObjectId,
            ref:"Department"
        },
        requestDept:{
            type:String,
            enum: ["fire_official", "police_official"],
            required:true
        },
        requestType:{
            type:String,
            required:true
        },
        status:{
            type:String,
            enum:["pending","accepted","resolved","rejected"],
            required:true
        },
        description:{
            type:String,
            required:true
        },
        createdAt:{
            type:Date,
            required:true
        },
        updatedAt:{
            type:Date,
            required:true
        }
    }
)

export const Emergency=Mongoose.model("Emergency",emergencySchema)