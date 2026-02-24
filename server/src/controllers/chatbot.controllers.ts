import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { ApiError } from "../utils/ApiError.ts";
import { runAgent } from "../services/langchain-agent.service.ts";

/**
 * POST /api/chatbot/chat
 * General chatbot endpoint (landing page - no auth required)
 */
const generalChat = asyncHandler(async (req: Request, res: Response) => {
  const { message, conversationHistory } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    throw new ApiError(400, "Message is required");
  }

  // For unauthenticated users, respond with a helpful pre-programmed message
  const content = message.toLowerCase();

  let response = "";

  if (
    content.includes("hello") ||
    content.includes("hi") ||
    content.includes("hey")
  ) {
    response =
      "Hello! Welcome to **Digital Khata** 🙏\n\nI'm your AI assistant. Digital Khata helps you manage your shop's inventory, sales, expenses, and customer credit (khata) — all in one place.\n\n**Here's what you can do:**\n- 📦 Track products & inventory\n- 💰 Record sales & payments\n- 📊 Get AI-powered business insights\n- 👥 Manage customer credit (udhar)\n- 📋 Track expenses & budgets\n\nSign up to get started!";
  } else if (
    content.includes("feature") ||
    content.includes("what can") ||
    content.includes("help")
  ) {
    response =
      "**Digital Khata Features:**\n\n• **Inventory Management** — Track products, stock levels, SKUs, and low-stock alerts\n• **Sales Recording** — Record sales with multiple payment methods (Cash, Credit, eSewa, Khalti)\n• **Expense Tracking** — Track business expenses with budget limits\n• **Customer Khata** — Manage customer credit/debit (udhar) records\n• **Supplier Management** — Keep track of your suppliers\n• **AI Reports** — Get intelligent business insights and analytics\n• **Receipt Generation** — Download receipts as images\n\nSign up to start managing your business!";
  } else if (
    content.includes("price") ||
    content.includes("cost") ||
    content.includes("free")
  ) {
    response =
      "Digital Khata is currently **free to use**! 🎉\n\nSign up and start managing your business right away. No credit card required.";
  } else if (
    content.includes("register") ||
    content.includes("sign up") ||
    content.includes("account")
  ) {
    response =
      'You can **sign up** by clicking the "Get Started" button on the homepage. You\'ll need:\n\n1. Your email address\n2. A password\n3. Your business details (name, type, location)\n\nThe setup takes less than 2 minutes!';
  } else {
    response = `Thanks for your message! I'm the Digital Khata assistant. Here's how I can help:\n\n- **Before sign-up**: I can tell you about our features, pricing, and how to get started\n- **After sign-up**: I become your AI business analyst — I can analyze your sales, inventory, expenses, and give you insights based on your real data\n\nWould you like to know about our features, or are you ready to sign up?`;
  }

  return res.status(200).json({
    success: true,
    data: {
      message: response,
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * POST /api/chatbot/analytics
 * AI-powered analytics chat (requires auth)
 */
const analyticsChat = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user?.activeShopId;

  if (!shopId) {
    throw new ApiError(401, "No active shop found. Please select a shop first.");
  }

  const { message, conversationHistory } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    throw new ApiError(400, "Message is required");
  }

  // Map frontend conversation history format to LangChain format
  const history = (conversationHistory || []).map(
    (msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "ai" : "user",
      content: msg.content,
    })
  );

  const aiResponse = await runAgent(
    shopId.toString(),
    message.trim(),
    history
  );

  return res.status(200).json({
    success: true,
    data: {
      message: aiResponse,
      timestamp: new Date().toISOString(),
    },
  });
});

export { generalChat, analyticsChat };
