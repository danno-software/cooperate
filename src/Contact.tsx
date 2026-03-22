import { useState, useEffect, useRef, type RefObject, type FormEvent } from "react";
import { usePageMeta } from "./usePageMeta.ts";

function useReveal<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

type Status = "idle" | "sending" | "sent" | "error";

function Contact() {
  usePageMeta(
    "お問い合わせ",
    "株式会社団野ソフトウェアへのお問い合わせはこちら。初回相談無料。",
    "/contact"
  );

  const sectionRef = useReveal<HTMLElement>();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="section contact-page" ref={sectionRef}>
      <div className="contact-inner">
        <span className="section-label-en">Contact</span>
        <h2>お問い合わせ</h2>
        <p className="contact-text">
          初回のご相談は無料です。お気軽にお問い合わせください。
        </p>

        {status === "sent" ? (
          <div className="contact-done">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h3>送信完了</h3>
            <p>お問い合わせありがとうございます。<br />確認メールをお送りしました。<br />担当者より2営業日以内にご連絡いたします。</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="contact-name">お名前 <span className="form-required">*</span></label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder="山田 太郎"
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-company">会社名</label>
              <input
                id="contact-company"
                name="company"
                type="text"
                placeholder="株式会社〇〇"
                autoComplete="organization"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">メールアドレス <span className="form-required">*</span></label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="example@company.com"
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">お問い合わせ内容 <span className="form-required">*</span></label>
              <textarea
                id="contact-message"
                name="message"
                required
                placeholder="ご相談内容をお書きください"
                rows={6}
              />
            </div>

            {status === "error" && (
              <p className="form-message form-message--error">
                送信に失敗しました。お手数ですが再度お試しください。
              </p>
            )}

            <button
              type="submit"
              className="contact-button"
              disabled={status === "sending"}
            >
              <span>{status === "sending" ? "送信中..." : "送信する"}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <div className="trust-badges">
              <span className="trust-badge">初回相談無料</span>
              <span className="trust-badge">NDA対応可</span>
              <span className="trust-badge">リモート対応</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default Contact;
