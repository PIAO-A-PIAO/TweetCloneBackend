import express from "express";
import { createChat, sendMessage, deleteChat, getMessage } from "../controllers/chat.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.delete("/:id", verifyToken, deleteChat);
router.get("/:id/message", getMessage);
router.post("/:id", verifyToken, createChat);
router.post("/:id/message", verifyToken, sendMessage);

export default router;