import mongoose,{Schema} from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const departmentSchema=new Schema(
    {
        departmentname:{
            type:String,
            required: true,
        },
        role: { 
            type: String, 
            enum: ["fire_official", "police_official"], 
            required: true 
        },
        email:{
            type:String,
            required: true,
            unique: true,
            lowercase:true,
            trim:true,
        },
        adminname:{
            type:String,
            required: true,
            unique: true,
            trim:true,
            index:true
        },
        password:{
            type:String,
            required:[true,'Password is required']
        },
        address:{
            type:String,
            required:true
        },
        refreshToken:{
            type:String
        },
        location: {
            latitude: {
                type: String,
            },
            longitude: {
                type: String,
            }
        }

    },
    {
        timestamps: true
    }
)

departmentSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password, 10)
    next()
})

departmentSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password, this.password)
}

departmentSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET_DEPT,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY_DEPT
    }
)
}
departmentSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    process.env.REFRESH_TOKEN_SECRET_DEPT,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const Department=mongoose.model("Department",departmentSchema)