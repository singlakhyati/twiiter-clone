import express, {Request,Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const secretKey="shalu"
export const createJwtToken=(user:{
    id: number;
    firstName: string;
    LastName: string;
    email: string;
    password: string;
})=>{

    return jwt.sign(user,secretKey,{expiresIn:"48h"})
}
export const verifyToken=(req:Request,res:Response,next:NextFunction)=>{    
    console.log(req.cookies);             //behave like a middleware
    let token=req.cookies.token;
    let decode=jwt.verify(token,secretKey);
    console.log(decode)
    if(decode){
        req.user=decode;
        return next();
    }
    res.send("token invalid");
}