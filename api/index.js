import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js'
import { test } from "./controller/userController.js";
import authRouter from "./routes/authRoute.js";
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
  console.log('connected successfully')
}).catch((err)=>{
  console.log(err);
})

const __dirname=path.resolve();
const app=express();
app.use(express.static(path.join(__dirname,'/client/dist')));

app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'client','dist','index.html'))
})

app.use(express.json());
app.use(cookieParser());

app.get('/',test)

app.use('/api/user',userRoute);
app.use('/api/auth',authRouter);

app.use((err,req,res,next)=>{
  const statusCode=err.statusCode || 500;
  const message=err.message || 'internal server error'
  return res.status(statusCode).json({
    success:false,
    message,
    statusCode,
  });
})

app.listen(3000,()=>{
  console.log('server running on port 3000')
})