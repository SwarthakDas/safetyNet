import mongoose,{Mongoose, Schema} from "mongoose";

const emergencySchema=new Schema(
    {
        raisedBy:{
            type:Schema.Types.ObjectId,
            ref:"Department"
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