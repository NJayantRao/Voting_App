import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();
const mongoURL= process.env.mongoDB_URL
//const mongoURL= process.env.DB_URL;

mongoose.connect(mongoURL)

const db= mongoose.connection;

import { User } from "./models/users.js";

db.on('connected',()=>{
    console.log("Connected to MONGODB server...")
})

db.on('error',()=>{
    console.log("MONGODB Connection Error...")
})

db.on('disconnected',()=>{
    console.log("Disconnected to MONGODB server...")
})

//export db connection
export {db};
