// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 本番URL。Vercel のドメインが決まったら .env の SITE_URL か直接書き換える。
const SITE = process.env.SITE_URL || 'https://himaname.com';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  trailingSlash: 'ignore',
});
