import express,{Request,Response} from "express";
import { PrismaClient } from '@prisma/client'
import { verifyToken } from "../utils/auth";
const prisma = new PrismaClient()
const router = express.Router();

router.post("/",async (req,res)=>{
    const {firstName,LastName,email,password}=req.body    //destuctor
    const response = await prisma.user.create({
        data: {
          firstName,LastName,email,password
        },
      })
      console.log(response);
      res.send({response})
})
router.get("/", async (req, res) => {
        const allUsers = await prisma.user.findMany();
        res.json(allUsers);
     
})
router.get("/:id",async(req,res)=>{
    const userId=parseInt(req.params.id);
    console.log(userId)
    const user = await prisma.user.findUnique({
        where:{
            id:userId
        }
    })
    if(!user){
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
})
router.delete("/:id",async (req,res)=>{
    const userId = parseInt(req.params.id);
    const deleteUser = await prisma.user.delete({
        where:{
            id:userId,
        }
    })
    res.json(deleteUser);
})
router.put("/:id",(req,res)=>{
    const userId = parseInt(req.params.id);
    // const (firstName,LastName,email,password)=req.body

})





export default router;