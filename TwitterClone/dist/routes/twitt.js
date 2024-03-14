"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("../utils/auth");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const userid = req.user.id;
    let result = yield prisma.twitt.create({
        data: {
            title,
            content,
            userid
        }
    });
    res.send({ result });
}));
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
router.get("/tweet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userTweet = yield prisma.twitt.findMany({
        include: {
            user: true
        }
    });
    res.json(userTweet);
}));
router.get("/tweet/:tweetid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tweetId = parseInt(req.params.tweetid);
    const userTweet = yield prisma.twitt.findUnique({
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
}));
router.delete("/tweet/:tweetid", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tweetId = parseInt(req.params.tweetid);
    const userId = req.user.id;
    //check the tweet exist
    const TweetExist = yield prisma.twitt.findUnique({
        where: {
            id: tweetId
        }
    });
    if (!TweetExist) {
        return res.status(404).json({ error: 'Tweet not found' });
    }
    // Check if the authenticated user is the owner of the tweet
    if (TweetExist.userid !== userId) {
        return res.status(403).json({ error: 'Unauthorized access. You are not the owner of this tweet.' });
    }
    //else delete the tweet
    yield prisma.twitt.delete({
        where: {
            id: tweetId
        }
    });
    res.json({ message: 'Tweet deleted successfully' });
}));
router.put("/tweet/:tweetid", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tweetId = parseInt(req.params.tweetid);
    const userId = req.user.id; // Assuming you store the user ID in the token payload
    const { title, content } = req.body;
    //check if the tweet exist
    const TweetExist = yield prisma.twitt.findUnique({
        where: {
            id: tweetId
        }
    });
    if (!TweetExist) {
        return res.status(404).json({ error: 'Tweet not found' });
    }
    // Check if the authenticated user is the owner of the tweet
    if (TweetExist.userid !== userId) {
        return res.status(403).json({ error: 'Unauthorized access. You are not the owner of this tweet.' });
    }
    //update the tweet
    const updatedTweet = yield prisma.twitt.update({
        where: {
            id: tweetId
        },
        data: {
            title,
            content
        }
    });
    res.json(updatedTweet);
}));
exports.default = router;
