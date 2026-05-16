import type { APIRoute } from 'astro';

import { absoluteUrl, resolveSiteUrl, sceneSeoItems } from '../data/seo';

const xmlEscape = (value: string) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');

export const GET: APIRoute = ({ site }) => {
	const base = resolveSiteUrl(site);
	const urls = sceneSeoItems
		.map(
			(scene) => `\t<url>
\t\t<loc>${xmlEscape(absoluteUrl(scene.route, base))}</loc>
\t\t<changefreq>monthly</changefreq>
\t\t<priority>${scene.route === '/' ? '1.0' : '0.8'}</priority>
\t</url>`
		)
		.join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8'
		}
	});
};
