import { useEffect, useRef } from "react";
import { usePageMeta } from "./usePageMeta.ts";
import { BOOKING_URL } from "./booking.ts";

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
  { label: "事業内容", value: "クラウドインフラ設計・構築 / クラウド運用・最適化 / 技術コンサルティング" },
  { label: "所在地", value: "大阪府大阪市北区梅田１丁目２番２号 大阪駅前第２ビル１２－１２" },
  { label: "法人番号", value: "6120001264667" },
];

function About() {
  usePageMeta(
    "会社概要",
    "株式会社団野ソフトウェアの会社概要。代表 団野優人。クラウドインフラ設計・構築、運用・最適化、技術コンサルティング。",
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

      <section className="abt-message">
        <div className="abt-message-inner page-reveal">
          <h2>代表メッセージ</h2>
          <div className="abt-message-body">
            <p>
              SIerでオンプレミス環境の設計・構築からキャリアをスタートし、その後クラウドインフラの領域に軸足を移しました。
              AWS・GCP・Azureを横断しながら、分析基盤やECプラットフォーム、業務システムなど、さまざまな現場でインフラの設計・構築・運用に携わってきました。
            </p>
            <p>
              8年間の実務を通じて、「もっと早く相談できる相手がいれば」という声を何度も聞いてきました。
              2024年に株式会社団野ソフトウェアを設立したのは、その課題に応えるためです。
            </p>
            <p>
              少数精鋭だからこそ、伝言ゲームなしのスピード感と、技術に対する責任を持った支援が可能です。
              お客様のチームの一員のような距離感で、技術課題の解決をお手伝いします。
            </p>
          </div>
        </div>
      </section>

      <section className="abt-career">
        <div className="abt-career-inner">
          <h2 className="page-reveal">経歴</h2>
          <div className="abt-career-timeline">
            {[
              {
                period: "2018 — 2020",
                title: "オンプレミス基盤の設計・構築",
                desc: "VMware vSphere / NetBackup / ストレージ更改など、物理インフラの提案から設計・構築・移行までを担当。",
              },
              {
                period: "2020 — 2022",
                title: "クラウド移行・分析基盤構築",
                desc: "AWS・GCPを中心に、IoT / データ分析基盤の設計・構築に従事。Terraform による IaC 管理、Cloud Build での CI/CD 構築を推進。",
              },
              {
                period: "2022 — 2024",
                title: "マルチクラウド環境の設計・運用",
                desc: "AWS・Azure・GCPの3クラウドにまたがるプロジェクトを複数並行で担当。Terraform / Bicep でのIaC化、CI/CD改善、ネットワーク設計など幅広く対応。",
              },
              {
                period: "2024 —",
                title: "株式会社団野ソフトウェア設立",
                desc: "これまでの経験をもとに、クラウドインフラの技術支援を専門とする会社を設立。設計・構築から運用最適化、技術コンサルティングまで一貫して提供。",
              },
            ].map((item, i) => (
              <div className="abt-career-item page-reveal" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="abt-career-period">{item.period}</span>
                <div className="abt-career-content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
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
          <a href={BOOKING_URL} className="contact-button">
            <span>お問い合わせ</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <div className="trust-badges">
            <span className="trust-badge">初回相談無料</span>
            <span className="trust-badge">NDA対応可</span>
            <span className="trust-badge">リモート対応</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
