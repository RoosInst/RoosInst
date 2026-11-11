// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://roos.com',
  // Every URL on roos.com is /name.html; keep it that way (MIGRATION_PLAN Phase 4).
  build: { format: 'file' },
  server: {
    port: 4321, // the visual harness's default VISUAL_LOCAL_URL
    // Mirror what roos.com's server sends; third-party embeds (YouTube, the
    // 5g/6g/testsets carousels) render differently without it.
    headers: { 'Referrer-Policy': 'same-origin' },
  },
  devToolbar: { enabled: false }, // it would show up in dev-server screenshots
});
