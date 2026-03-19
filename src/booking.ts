export const BOOKING_URL = "mailto:yuto7924@gmail.com";

export function bookingUrl(subject?: string): string {
  const sub = subject ?? "お問い合わせ";
  return `mailto:yuto7924@gmail.com?subject=${encodeURIComponent(sub)}&body=%E3%80%90%E3%81%8A%E5%90%8D%E5%89%8D%E3%80%91%0A%0A%E3%80%90%E3%81%94%E7%9B%B8%E8%AB%87%E5%86%85%E5%AE%B9%E3%80%91%0A`;
}
