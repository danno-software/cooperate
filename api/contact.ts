import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const CONTACT_TO = process.env.CONTACT_TO;

  if (!SENDGRID_API_KEY || !CONTACT_TO) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: CONTACT_TO }] }],
      from: { email: CONTACT_TO, name: "株式会社団野ソフトウェア" },
      reply_to: { email, name },
      subject: `【お問い合わせ】${name}様より`,
      content: [
        {
          type: "text/plain",
          value: `お名前: ${name}\nメールアドレス: ${email}\n\nお問い合わせ内容:\n${message}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    return res.status(500).json({ error: "Failed to send email" });
  }

  return res.status(200).json({ ok: true });
}
