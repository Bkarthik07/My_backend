// require('dotenv').config({path:'../env'})
import dotenv from 'dotenv'
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";



const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`mongodb connected DB host:${conn.connection.host}`)
    } catch (error) {
        console.log("MongoDb connection error",error);
        process.exit(1);
    }
}

export default connectDB