import { useEffect, useRef } from "react";
import { usePageMeta } from "./usePageMeta.ts";

function useRevealAll() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll(".page-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("page-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

const rows = [
  { label: "会社名", value: "株式会社団野ソフトウェア" },
  { label: "代表", value: "団野 優人" },
  { label: "設立", value: "2024年" },
  { label: "事業内容", value: "クラウドインフラ設計・構築 / クラウド運用・最適化 / アプリケーション開発 / 技術コンサルティング" },
  { label: "所在地", value: "大阪府大阪市北区梅田１丁目２番２号 大阪駅前第２ビル１２－１２" },
  { label: "法人番号", value: "6120001264667" },
];

function About() {
  usePageMeta(
    "会社概要",
    "株式会社団野ソフトウェアの会社概要。代表 団野優人。クラウドインフラ設計・構築、運用・最適化、アプリケーション開発、技術コンサルティング。",
    "/about"
  );

  const wrapperRef = useRevealAll();

  return (
    <div ref={wrapperRef}>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">About</span>
          <div className="page-hero-line" />
          <h1>会社概要</h1>
        </div>
      </section>

      <section className="abt-detail">
        <div className="abt-detail-inner">
          <dl className="abt-list">
            {rows.map((row, i) => (
              <div className="abt-row page-reveal" key={row.label} style={{ animationDelay: `${i * 0.08}s` }}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="page-cta">
        <div className="page-cta-inner page-reveal">
          <p className="page-cta-lead">まずはお気軽にご相談ください。</p>
          <a
            href="mailto:yuto7924@gmail.com?subject=お問い合わせ&body=【お名前】%0A%0A【ご相談内容】%0A"
            className="contact-button"
          >
            <span>メールで問い合わせる</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}

export default About;
