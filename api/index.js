import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
  console.log('connected successfully')
}).catch((err)=>{
  console.log(err);
})


const app=express();

app.get('/',(req,res)=>{
  console.log('hello from express')
})

app.listen(3000,()=>{
  console.log('server running on port 3000')
})