import mongoose,{Schema} from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        firstname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        lastname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
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

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: `${this.firstname} ${this.lastname}`
        },
        process.env.ACCESS_TOKEN_SECRET_USER,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY_USER
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: `${this.firstname} ${this.lastname}`
        },
        process.env.REFRESH_TOKEN_SECRET_USER,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY_USER
        }
    );
};

export const User=mongoose.model("User",userSchema)