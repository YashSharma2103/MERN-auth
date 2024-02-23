import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { deleteUser, updateUser } from '../controller/userController.js';
const router=express.Router();

router.get('/',(req,res)=>{
  res.json({message:'api working'});
})

router.post('/update/:id',verifyToken,updateUser)
router.delete('/delete/:id',verifyToken,deleteUser)

export default router;