import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { sendEmail } from "../helpers/sendEmail.ts";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set");
}

const client = new MongoClient(`${process.env.MONGODB_URI}/auth`);
const db = client.db();

export const auth = betterAuth({
  baseURL: "http://localhost:3000",
  trustedOrigins: ["http://localhost:5173"],
  user:{
    additionalFields:{
      activeShopId: { type: ["string", "null"], optional:true },
    }
  },
  database: mongodbAdapter(db, {
    client
  }),
  emailAndPassword: { 
    enabled: true, 
  },


  // emailVerification:{
  //   sendVerificationEmail: async ({ user, url, token }, request) => {
  //     void sendEmail({
  //       to: user.email,
  //       subject: `Verify your email Mr. ${user.name.trim().split(/\s+/)[0] || ""}`,
  //       text: `Please verify your email by clicking on the following link: ${url}`,
  //       html: `<p>Please verify your email by clicking on the following link:</p><a href="${url}">${url}</a>`,
  //     })
  //   }
  // },
  socialProviders: { 
    google:{
      clientId: process.env.GOOGLE_CLIENT_ID as string || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string || "",
    }
  },
});