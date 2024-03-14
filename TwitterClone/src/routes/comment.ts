import { PrismaClient } from '@prisma/client';
import express from 'express';
import { verifyToken } from '../utils/auth';

const prisma = new PrismaClient();
const router = express.Router();
router.get('/:tweetId',(req,res)=>{
    const { tweetId } = req.params;
    const userId = req.user.userId;
    
})
// Route to comment on a tweet
router.post('/:tweetId', verifyToken, async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    try {
        const tweet = await prisma.twitt.findUnique({ where: { id: Number(tweetId) } });

        if (!tweet) {
            return res.status(404).json({ message: 'Tweet not found' });
        }

        const comment = await prisma.comment.create({
            data: {
                // content,
                comment:content,
                userId,
                tweetId: tweet.id,
                // tweetid: tweetId,
            },
        });

        return res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to delete a comment
router.delete('/:commentId', verifyToken, async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.userId;

    try {
        const comment = await prisma.comment.findUnique({ where: { id: Number(commentId) } });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }

        await prisma.comment.delete({ where: { id: comment.id } });

        return res.json({ message: 'Comment deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;