import mongoose, { Schema } from "mongoose";
import { User } from "./user.model";

const logsSchema=new Schema(
    {
        refernceId:{
            type:Schema.Types.ObjectId,
            refpath:"referenceModel"
        },
        referenceModel:{
            type:String,
            required:true,
            enum:["Emergency","Complaint"]
        },
        userId:{
            type:String,
            enum: ["fire_official", "police_official"],
            required:true
        },
        message:{
            type:String,
            required:true
        },
    }
)

export const Logs=mongoose.model("Logs",logsSchema);