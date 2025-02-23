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
        required: true,
        default: Date.now
    },
    complaintImage:{
        type:String //cloudinary url
    },
    prediction:{
        type:String,
        enum:[
            "earthquake", "human_damage", "land_slide", "riot", 
            "road_accident", "urban_fire", "water_disaster", "wild_fire"
        ]
    }
})

export const Complaint=mongoose.model("Complaint",complaintSchema);