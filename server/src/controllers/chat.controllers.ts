import { asyncHandler, ApiError, ApiResponse } from '../utils/index.ts';
import type { Request, Response } from 'express';
import Chat from '../models/chat.models.ts';

// Get all chats for the current user's active shop
const getAllChats = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const shopId = (req as any).user?.activeShopId;

  if (!userId || !shopId) {
    throw new ApiError(401, "Unauthorized: User or shop not found");
  }

  const chats = await Chat.find({ 
    userId, 
    shopId, 
    isArchived: false 
  })
    .sort({ updatedAt: -1 })
    .select('title messages createdAt updatedAt');

  return res.status(200).json(
    new ApiResponse(200, chats, "Chats fetched successfully!")
  );
});

// Get archived chats
const getArchivedChats = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const shopId = (req as any).user?.activeShopId;

  if (!userId || !shopId) {
    throw new ApiError(401, "Unauthorized: User or shop not found");
  }

  const chats = await Chat.find({ 
    userId, 
    shopId, 
    isArchived: true 
  })
    .sort({ updatedAt: -1 })
    .select('title messages createdAt updatedAt');

  return res.status(200).json(
    new ApiResponse(200, chats, "Archived chats fetched successfully!")
  );
});

// Get a single chat by ID
const getChatById = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const shopId = (req as any).user?.activeShopId;
  const { chatId } = req.params;

  if (!userId || !shopId) {
    throw new ApiError(401, "Unauthorized: User or shop not found");
  }

  const chat = await Chat.findOne({ 
    _id: chatId, 
    userId, 
    shopId 
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  return res.status(200).json(
    new ApiResponse(200, chat, "Chat fetched successfully!")
  );
});

// Create a new chat
const createChat = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const shopId = (req as any).user?.activeShopId;
  const { title, messages } = req.body;

  if (!userId || !shopId) {
    throw new ApiError(401, "Unauthorized: User or shop not found");
  }

  if (!title || !messages || !Array.isArray(messages)) {
    throw new ApiError(400, "Title and messages are required");
  }

  const chat = await Chat.create({
    userId,
    shopId,
    title,
    messages,
    isArchived: false
  });

  return res.status(201).json(
    new ApiResponse(201, chat, "Chat created successfully!")
  );
});

// Update an existing chat (add messages or update title)
const updateChat = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const shopId = (req as any).user?.activeShopId;
  const { chatId } = req.params;
  const { title, messages } = req.body;

  if (!userId || !shopId) {
    throw new ApiError(401, "Unauthorized: User or shop not found");
  }

  const chat = await Chat.findOne({ 
    _id: chatId, 
    userId, 
    shopId 
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  if (title) chat.title = title;
  if (messages && Array.isArray(messages)) chat.messages = messages;

  await chat.save();

  return res.status(200).json(
    new ApiResponse(200, chat, "Chat updated successfully!")
  );
});

// Archive a chat
const archiveChat = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const shopId = (req as any).user?.activeShopId;
  const { chatId } = req.params;

  if (!userId || !shopId) {
    throw new ApiError(401, "Unauthorized: User or shop not found");
  }

  const chat = await Chat.findOne({ 
    _id: chatId, 
    userId, 
    shopId 
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  chat.isArchived = true;
  await chat.save();

  return res.status(200).json(
    new ApiResponse(200, chat, "Chat archived successfully!")
  );
});

// Unarchive a chat
const unarchiveChat = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const shopId = (req as any).user?.activeShopId;
  const { chatId } = req.params;

  if (!userId || !shopId) {
    throw new ApiError(401, "Unauthorized: User or shop not found");
  }

  const chat = await Chat.findOne({ 
    _id: chatId, 
    userId, 
    shopId 
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  chat.isArchived = false;
  await chat.save();

  return res.status(200).json(
    new ApiResponse(200, chat, "Chat unarchived successfully!")
  );
});

// Delete a chat permanently
const deleteChat = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const shopId = (req as any).user?.activeShopId;
  const { chatId } = req.params;

  if (!userId || !shopId) {
    throw new ApiError(401, "Unauthorized: User or shop not found");
  }

  const chat = await Chat.findOneAndDelete({ 
    _id: chatId, 
    userId, 
    shopId 
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  return res.status(200).json(
    new ApiResponse(200, null, "Chat deleted successfully!")
  );
});

// Search chats by title or message content
const searchChats = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const shopId = (req as any).user?.activeShopId;
  const { query } = req.query;

  if (!userId || !shopId) {
    throw new ApiError(401, "Unauthorized: User or shop not found");
  }

  if (!query || typeof query !== 'string') {
    throw new ApiError(400, "Search query is required");
  }

  const chats = await Chat.find({
    userId,
    shopId,
    isArchived: false,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { 'messages.content': { $regex: query, $options: 'i' } }
    ]
  })
    .sort({ updatedAt: -1 })
    .select('title messages createdAt updatedAt')
    .limit(20);

  return res.status(200).json(
    new ApiResponse(200, chats, "Search completed successfully!")
  );
});

export {
  getAllChats,
  getArchivedChats,
  getChatById,
  createChat,
  updateChat,
  archiveChat,
  unarchiveChat,
  deleteChat,
  searchChats
};
