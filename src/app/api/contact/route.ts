import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Simple in-memory rate limiting map (first line of defense against spam bots)
const ipCache = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3; // Max 3 contact forms per minute per IP

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();
    const rateData = ipCache.get(ip) || { count: 0, lastReset: now };

    if (now - rateData.lastReset > RATE_LIMIT_WINDOW) {
      rateData.count = 1;
      rateData.lastReset = now;
    } else {
      rateData.count++;
    }
    ipCache.set(ip, rateData);

    if (rateData.count > MAX_REQUESTS) {
      return NextResponse.json(
        { error: "Too many requests from this IP. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const { name, email, message } = await req.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    // 2. Security Sanitization (prevent SMTP header injection by stripping newlines/quotes)
    const sanitizedName = name.replace(/[\r\n"']/g, "").trim();
    const sanitizedEmail = email.replace(/[\r\n]/g, "").trim();

    // 3. Email Format Verification
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address structure." },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const rawPass = process.env.SMTP_PASS;
    const pass = rawPass ? rawPass.replace(/\s+/g, "") : undefined;
    const receiver = process.env.CONTACT_RECEIVER;

    if (!host || !user || !pass || !receiver) {
      console.warn("SMTP credentials are not fully configured in environment variables.");
      return NextResponse.json(
        { error: "Email service is temporarily misconfigured. Please try again later." },
        { status: 500 }
      );
    }

    // Create standard transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // True for port 465, false for other ports like 587
      auth: {
        user,
        pass,
      },
    });

    // 1. Notification Email to portfolio owner
    const ownerMailOptions = {
      from: `"${sanitizedName} (Contact Form)" <${user}>`,
      to: receiver,
      replyTo: sanitizedEmail,
      subject: `New Message from ${sanitizedName} via Portfolio`,
      text: `Name: ${sanitizedName}\nEmail: ${sanitizedEmail}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #2563eb; border-b: 1px solid #e2e8f0; padding-bottom: 8px;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p style="margin-top: 0; font-weight: bold; color: #475569;">Message:</p>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #334155;">${message}</p>
          </div>
        </div>
      `,
    };

    // 2. Receipt Confirmation Email to the user
    const userMailOptions = {
      from: `"Jaison Pradeep" <${user}>`,
      to: sanitizedEmail,
      subject: `Thank you for reaching out, ${sanitizedName}!`,
      text: `Hi ${sanitizedName},\n\nThank you for reaching out! I have received your message and will get back to you as soon as possible.\n\nBest regards,\nJaison Pradeep`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-top: 0;">Message Received!</h2>
          <p>Hi <strong>${sanitizedName}</strong>,</p>
          <p>Thank you for reaching out! I have successfully received your message and will get back to you as soon as possible.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">This is an automated confirmation of receipt for your message. Please do not reply directly to this email.</p>
          <p style="font-weight: bold; margin-top: 20px; color: #0f172a;">Jaison Pradeep</p>
          <p style="font-size: 12px; color: #64748b; margin-top: -10px;">Full Stack Developer & AI Engineer</p>
        </div>
      `,
    };

    // Dispatch both emails in parallel
    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return NextResponse.json({ success: true, message: "Emails sent successfully!" });
  } catch (error: any) {
    console.error("SMTP dispatch failed:", error);
    return NextResponse.json(
      { error: "Failed to dispatch email. " + (error.message || "") },
      { status: 500 }
    );
  }
}
