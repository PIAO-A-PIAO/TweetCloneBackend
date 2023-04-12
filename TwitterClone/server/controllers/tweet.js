import Tweet from '../models/Tweet.js';
import { handleError } from '../error.js';
import User from '../models/User.js';

export const getTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet) {
            return next(handleError(404, 'Tweet not found'));
        }
        res.status(200).json(tweet);
    } catch (err) {
        next(err);
    }
};

export const createTweet = async (req, res, next) => {
    const newTweet = new Tweet({ text: req.body.text, userId: req.user.id });
    try {
        const savedTweet = await newTweet.save();
        const user = await User.findById(req.user.id);
        await user.updateOne({ $push: { tweets: savedTweet._id } });
        await user.save();
        res.status(200).json(savedTweet);
    } catch (err) {
    handleError(500, err);
    }
};


export const deleteTweet = async (req, res, next) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (tweet.userId === req.user.id){
            const user = await User.findById(req.user.id);
            await user.updateOne({ $pull: { tweets: tweet._id } });
            await user.save();
            await tweet.deleteOne();
            res.status(200).json("tweet deleted");
        }else{
            return next(handleError(401, 'You are not authorized to delete this tweet'));
        };
    } catch (err) {
        next(err);
    }
}

export const likeOrUnlike = async (req, res, next) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (tweet.likes.includes(req.user.id)){
            await tweet.updateOne({$pull: {likes: req.user.id}});
            await tweet.save();
            return res.status(200).json("tweet unliked");
        } else {
            await tweet.updateOne({$push: {likes: req.user.id}});
            await tweet.save();
            return res.status(200).json("tweet liked");
        }
    } catch (err) {
        next(err);
    }
};

export const updateTweet = async (req, res, next) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet){
            return next(handleError(404, 'Tweet not found'));
        }
        if (tweet.userId!== req.user.id){
            return next(handleError(401, 'You are not authorized to update this tweet'));
        }
        const updatedTweet = await Tweet.findByIdAndUpdate(req.params.id, 
            {$set: {text: req.body.text}},
            {new: true})
        res.status(200).json(updatedTweet);
    } catch (err) {
        next(err);
    }
};

export const retweet = async (req, res, next) => {
    try {
        const original = await Tweet.findById(req.params.id);
        if (!original){
            return next(handleError(404, 'Tweet not found'));
        }
        const retweet = new Tweet({
            userId: req.body.userId,
            description: original.description,
            isRetweeted: true,
            originalTweetId: original._id,
            createdAt: original.timestamp,
            createdById: original.userId,
        })
        const updatedTweet = await retweet.save();
        res.status(200).json(updatedTweet);
    } catch (err) {
        next(err);
    }
};