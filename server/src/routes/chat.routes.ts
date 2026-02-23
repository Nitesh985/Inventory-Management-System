import { Router } from "express";
import { verifyBusinessAuth } from "../middlewares/auth.middlewares.ts";
import {
  getAllChats,
  getArchivedChats,
  getChatById,
  createChat,
  updateChat,
  archiveChat,
  unarchiveChat,
  deleteChat,
  searchChats
} from "../controllers/chat.controllers.ts";

const router = Router();
router.use(verifyBusinessAuth);

// Get all active chats
router.get("/", getAllChats);

// Get archived chats
router.get("/archived", getArchivedChats);

// Search chats
router.get("/search", searchChats);

// Get a specific chat by ID
router.get("/:chatId", getChatById);

// Create a new chat
router.post("/", createChat);

// Update a chat (add messages or update title)
router.put("/:chatId", updateChat);

// Archive a chat
router.patch("/:chatId/archive", archiveChat);

// Unarchive a chat
router.patch("/:chatId/unarchive", unarchiveChat);

// Delete a chat permanently
router.delete("/:chatId", deleteChat);

export default router;
