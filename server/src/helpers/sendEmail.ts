import nodemailer from "nodemailer";
import "dotenv/config"


export async function sendEmail({
  to,
  subject,
  text="",
  html="",
}: {
  to: string
  subject: string
  text?: string
  html?: string
}) {
  try{
    console.log("We are here on sendEmail")
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  
    const response = await transporter.sendMail({
      from: `📘 Digital Khata`,
      to,
      subject,
      text,
      html,
    });
    
    return response
    
  } catch(error){
    console.error("Error from send Email")
    throw error
  }
}
