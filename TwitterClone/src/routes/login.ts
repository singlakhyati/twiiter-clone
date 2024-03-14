import express, {Request,Response,NextFunction} from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createJwtToken } from "../utils/auth";
import { PrismaClient } from '@prisma/client'
import { request, response } from 'express';
const prisma = new PrismaClient()
const router = express.Router();

router.post("/",async (req:Request,res:Response)=>{
    const {email,password}=req.body;
    const user1=await prisma.user.findUnique({
        where:{
            email:email
        }
    });
    console.log(user1);
    if(!user1) return res.send("No user found");
  if(password==user1.password) {
       
            let token=createJwtToken(user1);
            res.cookie("token",token).send({token:token});

        
    };
})


export default router;