// サイト全体で使う定数（schema / About / 署名などで共有）
export const SITE = {
  name: import.meta.env.SITE_NAME || 'ひまつぶし・ネーミング研究所',
  description: '名前のアイデアと、ちょっとした暇つぶし。毎日更新。',
  // 本番URLは astro.config.mjs の site（= SITE_URL env）から取得するのが正。
  // schema用のフォールバックとしてのみ使用。
  url: import.meta.env.SITE_URL || 'https://himaname.com',
  logo: '/logo.svg',
  ogDefault: '/og-default.svg',
  lang: 'ja',
};

// 著者（E-E-A-T：一貫した署名）。AI生成＋人手編集の編集部として表現する。
export const AUTHOR = {
  name: `${SITE.name} 編集部`,
  url: '/about',
};
