import nodemailer from "nodemailer";

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
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `📘 Digital Khata`,
    to,
    subject,
    text,
    html,
  });
}
