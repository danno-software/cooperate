import { usePageMeta } from "./usePageMeta.ts";

function About() {
  usePageMeta(
    "会社概要",
    "株式会社団野ソフトウェアの会社概要。代表 団野優人。ソフトウェア開発・技術コンサルティング。"
  );

  return (
    <>
      <section className="services-hero">
        <p className="hero-label">About</p>
        <h1>会社概要</h1>
      </section>

      <section className="about-detail">
        <div className="about-detail-inner">
          <dl className="about-list">
            <div className="about-row">
              <dt>会社名</dt>
              <dd>株式会社団野ソフトウェア</dd>
            </div>
            <div className="about-row">
              <dt>代表</dt>
              <dd>団野 優人</dd>
            </div>
            <div className="about-row">
              <dt>設立</dt>
              <dd>2024年</dd>
            </div>
            <div className="about-row">
              <dt>事業内容</dt>
              <dd>ソフトウェア開発・技術コンサルティング</dd>
            </div>
            <div className="about-row">
              <dt>所在地</dt>
              <dd>大阪府大阪市北区梅田１丁目２番２号 大阪駅前第２ビル１２－１２</dd>
            </div>
            <div className="about-row">
              <dt>法人番号</dt>
              <dd>6120001264667</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="services-cta">
        <p>まずはお気軽にご相談ください。</p>
        <a
          href="mailto:yuto7924@gmail.com?subject=お問い合わせ"
          className="contact-button"
        >
          <span>メールで問い合わせる</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </section>
    </>
  );
}

export default About;
