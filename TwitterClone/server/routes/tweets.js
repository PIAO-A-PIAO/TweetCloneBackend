import express from "express";
import { verifyToken } from "../verifyToken.js";
import { createTweet, updateTweet, deleteTweet, likeOrUnlike, getTweet, retweet } from "../controllers/tweet.js";

const router = express.Router();

router.get('/:id', getTweet);
router.post('/', verifyToken, createTweet);
router.put('/:id', verifyToken, updateTweet);
router.delete('/:id', verifyToken, deleteTweet);
router.put('/:id/like', verifyToken, likeOrUnlike);
router.post('/:id/retweet', verifyToken, retweet);
export default router;