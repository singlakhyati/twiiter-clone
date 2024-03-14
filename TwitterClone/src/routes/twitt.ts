import express,{Request,Response,NextFunction} from "express";
import { PrismaClient } from '@prisma/client'
import { verifyToken } from "../utils/auth";
const prisma = new PrismaClient()
const router = express.Router();

router.post("/",verifyToken,async (req,res)=>{
    const {title,content} = req.body;
    const userid = req.user.id;
    let result = await prisma.twitt.create({
        data:{
            title,
            content,
            userid
        }
    })
    res.send({result})
})

// router.post("/tweet",async (req,res)=>{
//     const {title,content}=req.body    //destuctor
//     const userId = req.user;
//     if (!userId) {
//         return res.status(401).json({ error: "User not authenticated" });
//     }
//     const response = await prisma.twitt.create({
//         data: {
//             title,content,
//             user: {
//                 connect: { id: userId } // Connect the tweet to the user by their id
//             }
//         },
//       })
//       console.log(response);
//       res.send({response})
// })

router.get("/tweet",async (req: Request,res: Response)=>{
    const userTweet=await prisma.twitt.findMany({
        include: {
            user: true
        }
    });
    res.json(userTweet);
    
})

router.get("/tweet/:tweetid",async (req,res)=>{
    const tweetId=parseInt(req.params.tweetid);
    const userTweet = await prisma.twitt.findUnique({
        where: {
            id: tweetId
        },
        include: {
            user: true
        }
    });

    if (!userTweet) {
        return res.status(404).json({ error: 'Tweet not found' });
    }

    // Return the tweet with user information
    res.json(userTweet);
})

router.delete("/tweet/:tweetid",verifyToken,async (req,res)=>{
    const tweetId=parseInt(req.params.tweetid);
    const userId=req.user.id;
    //check the tweet exist
    const TweetExist=await prisma.twitt.findUnique({
        where:{
            id:tweetId
        }
    })
    if (!TweetExist) {
        return res.status(404).json({ error: 'Tweet not found' });
    }
    // Check if the authenticated user is the owner of the tweet
    if(TweetExist.userid!==userId){
        return res.status(403).json({ error: 'Unauthorized access. You are not the owner of this tweet.' });
    }
    //else delete the tweet
    await prisma.twitt.delete({
        where: {
            id: tweetId
        }
    });

    res.json({ message: 'Tweet deleted successfully' });
})

router.put("/tweet/:tweetid",verifyToken,async(req,res)=>{
    const tweetId = parseInt(req.params.tweetid);
    const userId = req.user.id; // Assuming you store the user ID in the token payload
    const { title, content } = req.body;
    //check if the tweet exist
    const TweetExist=await prisma.twitt.findUnique({
        where:{
            id:tweetId
        }
    })
    if (!TweetExist) {
        return res.status(404).json({ error: 'Tweet not found' });
    }
     // Check if the authenticated user is the owner of the tweet
    if (TweetExist.userid !== userId) {
        return res.status(403).json({ error: 'Unauthorized access. You are not the owner of this tweet.' });
    }

    //update the tweet
    const updatedTweet = await prisma.twitt.update({
        where: {
            id: tweetId
        },
        data: {
            title,
            content
        }
    });

    res.json(updatedTweet);
})



export default router;
