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

function Services() {
  usePageMeta(
    "事業内容",
    "クラウドインフラ設計・構築、クラウド運用・最適化、アプリケーション開発、技術コンサルティング。株式会社団野ソフトウェア。",
    "/services"
  );

  const wrapperRef = useRevealAll();

  return (
    <div ref={wrapperRef}>
      <section className="srv-hero">
        <div className="srv-hero-inner">
          <span className="srv-hero-label">Services</span>
          <div className="srv-hero-line" />
          <h1>事業内容</h1>
          <p className="srv-hero-sub">
            クラウドインフラからアプリケーション開発まで、<br />
            実務経験に基づいた技術支援を提供します。
          </p>
        </div>
      </section>

      <section className="srv-target">
        <div className="srv-target-inner">
          <h2 className="page-reveal">こんな課題はありませんか？</h2>
          <div className="srv-target-grid">
            {[
              "クラウド環境を手動で管理していて、属人化やミスが不安",
              "インフラ専任のエンジニアがおらず、設計・構築を任せたい",
              "採用が決まるまでの間、インフラまわりを外部に頼りたい",
              "クラウドの月額コストが高いが、どこを削ればいいかわからない",
              "新しいサービスを素早く形にして検証したい",
              "技術的な判断を相談できる相手がいない",
            ].map((text, i) => (
              <div className="srv-target-item page-reveal" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                <svg className="srv-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="srv-strength">
        <div className="srv-strength-inner">
          <h2 className="page-reveal">1人法人だからできること</h2>
          <div className="srv-strength-grid">
            {[
              { title: "伝言ゲームなし", desc: "窓口と作業者が同一人物。要件の認識ずれが起きません。" },
              { title: "意思決定が速い", desc: "社内承認不要。相談から見積もり・着手まで最短で対応します。" },
              { title: "柔軟な関わり方", desc: "スポットの技術相談から継続的な開発支援まで、規模を問わず対応できます。" },
            ].map((item, i) => (
              <div className="srv-strength-item page-reveal" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="srv-strength-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="srv-flow">
        <div className="srv-flow-inner">
          <h2 className="page-reveal">ご依頼の流れ</h2>
          <div className="srv-flow-steps">
            {[
              { step: "01", title: "ヒアリング", desc: "現状の課題やご要望をお聞かせください。" },
              { step: "02", title: "ご提案", desc: "スコープ・進め方・お見積りをご提示します。" },
              { step: "03", title: "実施", desc: "合意いただいた内容で作業を進めます。" },
              { step: "04", title: "納品・振り返り", desc: "成果物の確認と、今後の改善点を共有します。" },
            ].map((item, i) => (
              <div className="srv-flow-step page-reveal" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="srv-flow-num">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="srv-detail">
        <div className="srv-detail-inner">
          {[
            {
              num: "01",
              title: "クラウドインフラ設計・構築",
              desc: "クラウド環境の設計・構築を、IaC（Infrastructure as Code）による再現性の高い形で提供します。ネットワーク設計やセキュリティ設計も含め、インフラ全体を一貫して対応します。",
              tagLabel: "対応技術",
              tags: ["AWS", "Google Cloud", "Azure", "Terraform", "Bicep"],
              scope: [
                "クラウド環境の設計・構築（新規・移行）",
                "Terraform / Bicep によるIaC導入・既存環境のコード化",
                "VPC / VNet 設計、サブネット分割、ルーティング設計",
                "セキュリティグループ・IAM ポリシーの設計",
                "マルチアカウント / マルチクラウド構成の設計",
                "CI/CD パイプラインとの連携",
              ],
            },
            {
              num: "02",
              title: "クラウド運用・最適化",
              desc: "稼働中のクラウド環境を対象に、コスト削減・監視強化・運用フロー改善を支援します。現状を調査したうえで、優先度の高い施策から着手します。",
              tagLabel: "対応技術",
              tags: ["AWS", "Google Cloud", "Azure", "CloudWatch", "Datadog"],
              scope: [
                "クラウド利用料の分析・コスト削減提案",
                "未使用・過剰リソースの洗い出しと整理",
                "リザーブドインスタンス・Savings Plans の検討",
                "監視・アラート基盤の設計と導入",
                "ログ収集・分析基盤の構築",
                "運用手順の整備・自動化",
              ],
            },
            {
              num: "03",
              title: "アプリケーション開発",
              desc: "Webアプリケーションの設計・開発を行います。AIツールを活用した高速なプロトタイピングから、本番運用を見据えた開発まで対応します。",
              tagLabel: "対応技術",
              tags: ["React", "TypeScript", "Node.js", "Python", "Claude Code"],
              scope: [
                "Webアプリケーションの設計・実装",
                "AIツールを活用したプロトタイプの素早い構築",
                "API 設計・バックエンド開発",
                "既存アプリケーションの改修・機能追加",
              ],
            },
            {
              num: "04",
              title: "技術コンサルティング",
              desc: "技術選定やアーキテクチャの意思決定を第三者の視点から支援します。特定の技術や製品に偏らない、実務経験に基づいた助言を提供します。",
              tagLabel: "対応領域",
              tags: ["クラウドアーキテクチャ", "技術選定", "セキュリティ", "DevOps"],
              scope: [
                "既存アーキテクチャのレビュー・改善提案",
                "技術選定・ツール選定の支援",
                "チームへのナレッジ共有・ハンズオン支援",
                "セキュリティ観点でのレビュー・助言",
              ],
            },
          ].map((svc) => (
            <article className="srv-card page-reveal" key={svc.num}>
              <div className="srv-card-header">
                <span className="srv-card-num">{svc.num}</span>
                <h2>{svc.title}</h2>
              </div>
              <div className="srv-card-body">
                <p className="srv-card-desc">{svc.desc}</p>
                <div className="srv-card-tags">
                  <h3>{svc.tagLabel}</h3>
                  <ul>
                    {svc.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="srv-card-scope">
                  <h3>支援内容</h3>
                  <ul>
                    {svc.scope.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
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

export default Services;
