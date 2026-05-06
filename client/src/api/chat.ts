import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api/chats`,
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
  const res = await api.get("/");
  return res.data;
}

// Get archived chats
async function getArchivedChats() {
  const res = await api.get("/archived");
  return res.data;
}

// Get a specific chat by ID
async function getChatById(chatId: string) {
  const res = await api.get(`/${chatId}`);
  return res.data;
}

// Create a new chat
async function createChat(title: string, messages: Message[]) {
  const res = await api.post("/", { title, messages });
  return res.data;
}

// Update a chat (add messages or update title)
async function updateChat(chatId: string, data: { title?: string; messages?: Message[] }) {
  const res = await api.put(`/${chatId}`, data);
  return res.data;
}

// Archive a chat
async function archiveChat(chatId: string) {
  const res = await api.patch(`/${chatId}/archive`);
  return res.data;
}

// Unarchive a chat
async function unarchiveChat(chatId: string) {
  const res = await api.patch(`/${chatId}/unarchive`);
  return res.data;
}

// Delete a chat permanently
async function deleteChat(chatId: string) {
  const res = await api.delete(`/${chatId}`);
  return res.data;
}

// Search chats
async function searchChats(query: string) {
  const res = await api.get("/search", { params: { query } });
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
