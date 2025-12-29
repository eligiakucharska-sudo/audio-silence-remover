import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "YOUR_EMAIL@gmail.com",
      pass: "YOUR_EMAIL_APP_PASSWORD"
    }
  });

  await transporter.sendMail({
    from: `"${name}" <${email}>`,
    to: "deboamtech@gmail.com",
    subject: `Website Contact Form`,
    text: message,
  });

  return NextResponse.json({ success: true });
}
