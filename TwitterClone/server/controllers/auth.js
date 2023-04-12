import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { handleError } from '../error.js';

export const signup = async (req, res, next) => {
    try {
        if (req.body.password.length < 8) {
            return next(handleError(400, 'Password must be at least 8 characters long'));
        }
        const user = await User.findOne({email: req.body.email});
        if (user) {
            return next(handleError(400, 'User already exists'));
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            ...req.body,
            password: hash
        });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT);
        const {password, ...otherData} = newUser._doc;
        res.cookie('access_token', token, {
            httpOnly: true,
        }).status(200).json(otherData);
    }catch(err) {
        next(err);
    }
};

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return next(handleError(404, 'User not found'));
        }
        const pwCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!pwCorrect) {
            return next(handleError(401, 'Invalid password'));
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const {password, ...otherData} = user._doc;

        res.cookie("access_token", token, {
            httpOnly: true
        })
        res.status(200).json({ token, user: otherData });
    } catch (err) {
        next(err);
    };
};

export const cancelAccount = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        await user.deleteOne();
        res.clearCookie("access_token");
        res.status(200).json("Account cancelled successfully");
    } catch (err) {
        next(err);
    };
};