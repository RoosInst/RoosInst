/**
 * Runs on every page at build time (and in dev), except partials. Turns FontAwesome <i> icons
 * into inline <svg> on pages that link FA's stylesheet, for ported .astro
 * pages and the legacy pass-through alike. Pages without the stylesheet never
 * loaded FA's script, so they never showed icons; they're left alone.
 */
import { defineMiddleware } from 'astro:middleware';
import { inlineIcons, FA_CSS_HREF } from './lib/fontawesome.mjs';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.startsWith('text/html')) return response;
  // Partials (_bottom.html, _template.html, ...) are served exactly as written.
  if (/\/_[^/]*$/.test(context.url.pathname)) return response;
  const html = await response.text();
  const body = html.includes(FA_CSS_HREF) ? inlineIcons(html, context.url.pathname) : html;
  return new Response(body, { status: response.status, headers: response.headers });
});
