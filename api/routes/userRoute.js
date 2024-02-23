import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { updateUser } from '../controller/userController.js';
const router=express.Router();

router.get('/',(req,res)=>{
  res.json({message:'api working'});
})

router.post('/update/:id',verifyToken,updateUser)

export default router;