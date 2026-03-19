// Cal.com のURLが決まったらここを差し替えるだけで全CTAが切り替わる
// 例: "https://cal.com/yutodanno/30min"
export const BOOKING_URL = "mailto:yuto7924@gmail.com?subject=お問い合わせ&body=【お名前】%0A%0A【ご相談内容】%0A";

export function bookingUrl(subject?: string): string {
  if (BOOKING_URL.startsWith("mailto:")) {
    return subject
      ? `mailto:yuto7924@gmail.com?subject=${encodeURIComponent(subject)}&body=【お名前】%0A%0A【ご相談内容】%0A`
      : BOOKING_URL;
  }
  // Cal.com の場合はそのまま返す（subjectはCal側で設定）
  return BOOKING_URL;
}
