import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectToDB } from "./db/index.ts";
import chatbotRoutes from "./routes/chatbot.routes.ts";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use chatbot routes
app.use("/api/chatbot", chatbotRoutes);

// Connect to DB and start server
connectToDB()
  .then(async () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`The app is listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Connection to Mongodb failed ::", error);
  });

console.log("Hello");