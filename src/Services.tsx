import { useEffect, useRef, useState } from "react";
import { usePageMeta } from "./usePageMeta.ts";
import { BOOKING_URL, bookingUrl } from "./booking.ts";

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

const faqs = [
  { q: "初回の相談に費用はかかりますか？", a: "いいえ。初回のヒアリング・ご相談は無料です。課題やご要望をお聞かせいただいたうえで、お見積りをご提示します。" },
  { q: "リモートでの対応は可能ですか？", a: "はい。基本的にオンラインで対応しています。オンラインミーティング・チャットツール等、お客様の環境に合わせて柔軟に対応します。" },
  { q: "NDAの締結は可能ですか？", a: "はい、可能です。ご要望に応じて業務開始前にNDAを締結します。" },
  { q: "最低契約期間はありますか？", a: "ありません。スポットでの技術相談から継続支援まで、期間の縛りなくご利用いただけます。" },
  { q: "どのくらいの規模の案件から対応できますか？", a: "規模は問いません。「ちょっと聞きたい」レベルのスポット相談から、数ヶ月のプロジェクトまで対応しています。" },
  { q: "すぐに稼働を開始できますか？", a: "状況によりますが、最短で翌営業日から着手可能です。まずはお気軽にご相談ください。" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " faq-item--open" : ""}`}>
      <button type="button" className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <svg className="faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
      <div className="faq-answer">
        <p>{a}</p>
      </div>
    </div>
  );
}

function Services() {
  usePageMeta(
    "事業内容",
    "クラウドインフラ設計・構築、クラウド運用・最適化、技術コンサルティング。株式会社団野ソフトウェア。",
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
            クラウドインフラの設計・構築から運用最適化まで、<br />
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
              "正社員を採用するほどではないが、インフラを任せられる人が欲しい",
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
          <h2 className="page-reveal">私たちの強み</h2>
          <div className="srv-strength-grid">
            {[
              { title: "伝言ゲームなし", desc: "担当者が直接対応。要件の認識ずれが起きません。" },
              { title: "意思決定が速い", desc: "相談から見積もり・着手まで最短で対応します。" },
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
              num: "01", title: "クラウドインフラ設計・構築",
              desc: "クラウド環境の設計・構築を、IaC（Infrastructure as Code）による再現性の高い形で提供します。ネットワーク設計やセキュリティ設計も含め、インフラ全体を一貫して対応します。",
              tagLabel: "対応技術", tags: ["AWS", "Google Cloud", "Azure", "Terraform", "Bicep"],
              scope: ["クラウド環境の設計・構築（新規・移行）", "Terraform / Bicep によるIaC導入・既存環境のコード化", "VPC / VNet 設計、サブネット分割、ルーティング設計", "セキュリティグループ・IAM ポリシーの設計", "マルチアカウント / マルチクラウド構成の設計", "CI/CD パイプラインとの連携"],
            },
            {
              num: "02", title: "クラウド運用・最適化",
              desc: "稼働中のクラウド環境を対象に、コスト削減・監視強化・運用フロー改善を支援します。現状を調査したうえで、優先度の高い施策から着手します。",
              tagLabel: "対応技術", tags: ["AWS", "Google Cloud", "Azure", "CloudWatch", "Datadog"],
              scope: ["クラウド利用料の分析・コスト削減提案", "未使用・過剰リソースの洗い出しと整理", "リザーブドインスタンス・Savings Plans の検討", "監視・アラート基盤の設計と導入", "ログ収集・分析基盤の構築", "運用手順の整備・自動化"],
            },
            {
              num: "03", title: "技術コンサルティング",
              desc: "技術選定やアーキテクチャの意思決定を第三者の視点から支援します。特定の技術や製品に偏らない、実務経験に基づいた助言を提供します。",
              tagLabel: "対応領域", tags: ["クラウドアーキテクチャ", "技術選定", "セキュリティ", "DevOps"],
              scope: ["既存アーキテクチャのレビュー・改善提案", "技術選定・ツール選定の支援", "チームへのナレッジ共有・ハンズオン支援", "セキュリティ観点でのレビュー・助言"],
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
                  <ul>{svc.tags.map((t) => (<li key={t}>{t}</li>))}</ul>
                </div>
                <div className="srv-card-scope">
                  <h3>支援内容</h3>
                  <ul>{svc.scope.map((s) => (<li key={s}>{s}</li>))}</ul>
                </div>
                <a href={bookingUrl(svc.title + "について相談")} className="srv-card-cta">
                  このサービスについて相談する
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="srv-cases">
        <div className="srv-cases-inner">
          <h2 className="page-reveal">対応事例</h2>
          <p className="srv-cases-note page-reveal">
            以下は対応事例の一部です。記載以外の領域もお気軽にご相談ください。
          </p>
          <div className="srv-cases-grid">
            {[
              {
                tag: "IaC",
                title: "クラウド環境の IaC 化",
                challenge: "クラウドリソースがすべて手動構築で、環境差異や属人化が発生していた。",
                approach: "Terraform / Bicep によるコード管理を導入し、CI/CD パイプラインと連携。環境ごとにパラメータを切り替える構成に整備。",
                result: "環境構築の再現性を確保し、変更がコードレビュー可能な運用に移行。",
              },
              {
                tag: "デプロイ",
                title: "ゼロダウンタイムデプロイの実現",
                challenge: "アプリケーション更新のたびにサービス停止が発生し、営業時間中のリリースが困難だった。",
                approach: "ステージングスロットを活用したスワップ方式を導入し、デプロイパイプラインを自動化。",
                result: "営業時間中でもリリース可能になり、リリース頻度が向上。問題時は即座に切り戻し可能に。",
              },
              {
                tag: "ネットワーク",
                title: "VPC / VNet のサブネット分離設計",
                challenge: "ネットワークがフラットな構成で、リソース間のアクセス制御が不十分だった。",
                approach: "用途別の多層サブネット設計、セキュリティグループ / NSG の整備、PaaS 接続のプライベート化を実施。",
                result: "セキュリティ基準を満たすネットワーク構成を実現。",
              },
              {
                tag: "コスト最適化",
                title: "クラウド利用料の分析と削減",
                challenge: "クラウドの月額費用が増加傾向にあり、最適化の余地が見えていなかった。",
                approach: "利用状況の分析、未使用リソースの整理、ストレージタイプの見直し、検証環境の自動停止/起動を導入。",
                result: "月額コストを大幅に削減。",
              },
              {
                tag: "DNS",
                title: "DNS ゾーンの分離と移行",
                challenge: "DNS レコードが一箇所に集中し、誤変更のリスクが高い状態だった。",
                approach: "環境ごとのゾーン分離設計を行い、IaC によるレコード管理に移行。",
                result: "変更影響の局所化と、レコード変更の監査証跡を確保。",
              },
              {
                tag: "CI/CD",
                title: "CI/CD パイプラインの刷新",
                challenge: "既存の CI/CD が複数リポジトリに分散し、管理コストが増大していた。",
                approach: "GitHub Actions への統合移行を実施し、OIDC 認証によるセキュアなデプロイを設計。",
                result: "シークレット管理の簡素化とデプロイの統一管理を実現。",
              },
              {
                tag: "認証基盤",
                title: "BaaS 環境のセキュリティ改善と運用整備",
                challenge: "複数アプリケーションが同一 BaaS 基盤を共有しており、アプリ間の認可制御が不十分だった。",
                approach: "アクセス制御ロジックの設計・実装、DB マイグレーションの GitHub Actions による自動化、運用フローの整備。",
                result: "認可の脆弱性を解消し、DB 変更を安全にデプロイできる体制を確立。",
              },
              {
                tag: "DB移行",
                title: "データベースのバージョンアップグレード",
                challenge: "DB エンジンのサポート終了に伴い、安全にアップグレードする必要があった。",
                approach: "互換性チェックスクリプトによる自動検証、スナップショット比較による差分確認、段階的な移行プロセスを設計。",
                result: "既存アプリケーションへの影響なくアップグレードを完了。",
              },
            ].map((c, i) => (
              <article className="srv-case-card page-reveal" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                <span className="srv-case-tag">{c.tag}</span>
                <h3>{c.title}</h3>
                <dl className="srv-case-dl">
                  <div className="srv-case-row">
                    <dt>課題</dt>
                    <dd>{c.challenge}</dd>
                  </div>
                  <div className="srv-case-row">
                    <dt>対応</dt>
                    <dd>{c.approach}</dd>
                  </div>
                  <div className="srv-case-row">
                    <dt>成果</dt>
                    <dd>{c.result}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="srv-pricing">
        <div className="srv-pricing-inner">
          <h2 className="page-reveal">料金・契約形態</h2>
          <p className="srv-pricing-note page-reveal">
            業務委託契約でのご提供となります。内容に応じて最適な形態をご提案します。
          </p>
          <div className="srv-pricing-grid">
            <div className="srv-pricing-card page-reveal">
              <h3>スポット技術相談</h3>
              <div className="srv-pricing-price">
                <span className="srv-pricing-amount">2</span>
                <span className="srv-pricing-unit">万円〜 / 回</span>
              </div>
              <p>アーキテクチャの壁打ち、技術選定の相談、既存構成のレビューなど。1〜2時間のオンラインミーティング形式。</p>
            </div>
            <div className="srv-pricing-card srv-pricing-card--accent page-reveal">
              <h3>継続支援</h3>
              <div className="srv-pricing-price">
                <span className="srv-pricing-amount">20</span>
                <span className="srv-pricing-unit">万円〜 / 月</span>
              </div>
              <p>月20〜80時間の範囲で、インフラ運用・開発支援を継続的に提供します。稼働時間はプロジェクトに応じて柔軟に調整可能です。</p>
            </div>
            <div className="srv-pricing-card page-reveal">
              <h3>短期プロジェクト</h3>
              <div className="srv-pricing-price">
                <span className="srv-pricing-amount">個別見積もり</span>
              </div>
              <p>新規構築、移行、IaC導入など、スコープが明確な案件はプロジェクト単位でお見積りします。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="srv-faq">
        <div className="srv-faq-inner">
          <h2 className="page-reveal">よくある質問</h2>
          <div className="faq-list page-reveal">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
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

export default Services;
