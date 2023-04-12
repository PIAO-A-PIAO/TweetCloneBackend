import express from "express";
import { getUser, updateUser } from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();
router.get('/find/:id', getUser);
router.put('/:id', verifyToken, updateUser)

export default router;