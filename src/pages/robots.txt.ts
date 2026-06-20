import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const body = `User-agent: *
Allow: /

# AIクローラも許可（AEO/GEO：AI検索の引用源を狙う）
User-agent: GPTBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: ${sitemap}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
