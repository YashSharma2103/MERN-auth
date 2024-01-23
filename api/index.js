import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js'
import { test } from "./controller/userController.js";
import authRouter from "./routes/authRoute.js";
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
  console.log('connected successfully')
}).catch((err)=>{
  console.log(err);
})


const app=express();
app.use(express.json());

app.get('/',test)

app.use('/test',userRoute);
app.use('/test',authRouter);

app.listen(3000,()=>{
  console.log('server running on port 3000')
})