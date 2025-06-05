// pages/api/send-ip.ts
import nodemailer from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { ip } = JSON.parse(req.body);

  if (!ip) return res.status(400).json({ error: 'Missing IP address' });

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"IP Logger" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: 'Nouvelle IP capturée',
      text: `Adresse IP : ${ip}`,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
