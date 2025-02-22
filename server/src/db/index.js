import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
import { DB_NAME } from "../constants.js";//DB_NAME is not required here
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const connetDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}`)//mongoose.connet() used to establish connection between mongodb atlas
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        
    }catch(error){
        console.log("MONGODB connection failed", error);
        process.exit(1)
    }
}

export default connetDB 
