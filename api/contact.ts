import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const RESEND_APIKEY = process.env.RESEND_APIKEY;
  const CONTACT_TO = process.env.CONTACT_TO;

  if (!RESEND_APIKEY || !CONTACT_TO) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const resend = new Resend(RESEND_APIKEY);

  const companyLine = company ? `会社名: ${company}\n` : "";

  try {
    // 管理者への通知メール
    await resend.emails.send({
      from: "株式会社団野ソフトウェア <noreply@danno-software.com>",
      to: [CONTACT_TO],
      replyTo: email,
      subject: `【お問い合わせ】${name}様より`,
      text: `お名前: ${name}\n${companyLine}メールアドレス: ${email}\n\nお問い合わせ内容:\n${message}`,
    });

    // お客様への確認メール
    await resend.emails.send({
      from: "株式会社団野ソフトウェア <noreply@danno-software.com>",
      to: [email],
      subject: "【団野ソフトウェア】お問い合わせありがとうございます",
      text: `${name} 様\n\nこの度はお問い合わせいただき、誠にありがとうございます。\n以下の内容で承りました。\n\n─────────────────────\nお名前: ${name}\n${companyLine}メールアドレス: ${email}\n\nお問い合わせ内容:\n${message}\n─────────────────────\n\n担当者より2営業日以内にご連絡いたします。\nしばらくお待ちくださいますようお願いいたします。\n\n──\n株式会社団野ソフトウェア\nhttps://danno-software.com\n`,
    });

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to send email" });
  }
}
