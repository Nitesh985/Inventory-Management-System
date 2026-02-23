import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export interface Message {
  id: string;
  type: 'system' | 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface Chat {
  _id: string;
  title: string;
  messages: Message[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// Get all active chats
async function getAllChats() {
  const res = await api.get("/chats");
  return res.data;
}

// Get archived chats
async function getArchivedChats() {
  const res = await api.get("/chats/archived");
  return res.data;
}

// Get a specific chat by ID
async function getChatById(chatId: string) {
  const res = await api.get(`/chats/${chatId}`);
  return res.data;
}

// Create a new chat
async function createChat(title: string, messages: Message[]) {
  const res = await api.post("/chats", { title, messages });
  return res.data;
}

// Update a chat (add messages or update title)
async function updateChat(chatId: string, data: { title?: string; messages?: Message[] }) {
  const res = await api.put(`/chats/${chatId}`, data);
  return res.data;
}

// Archive a chat
async function archiveChat(chatId: string) {
  const res = await api.patch(`/chats/${chatId}/archive`);
  return res.data;
}

// Unarchive a chat
async function unarchiveChat(chatId: string) {
  const res = await api.patch(`/chats/${chatId}/unarchive`);
  return res.data;
}

// Delete a chat permanently
async function deleteChat(chatId: string) {
  const res = await api.delete(`/chats/${chatId}`);
  return res.data;
}

// Search chats
async function searchChats(query: string) {
  const res = await api.get("/chats/search", { params: { query } });
  return res.data;
}

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
