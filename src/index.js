import dotenv from 'dotenv'
import mongoose from "mongoose";
import { app } from './app.js';
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})


;(()=>{connectDB()
    .then(()=>{
        app.listen(process.env.PORT || 8080,()=>{
            console.log(`server is running at post : http://localhost:${process.env.PORT || 8080}`)
        })
    })
    .catch((error)=>{
        console.log("Mongodb connnection error",error)
    })
})()
// import express from "express"

// const app = express();

// ;( async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on("error",()=>{
//             console.log("error",error);
//             throw error;
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on post ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log("Error",error);
//         throw error;
//     }
// })()


