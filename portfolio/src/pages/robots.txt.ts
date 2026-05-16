import type { APIRoute } from 'astro';

import { absoluteUrl, resolveSiteUrl } from '../data/seo';

export const GET: APIRoute = ({ site }) => {
	const base = resolveSiteUrl(site);
	const body = [
		'User-agent: *',
		'Allow: /',
		'',
		`Sitemap: ${absoluteUrl('/sitemap.xml', base)}`
	].join('\n');

	return new Response(`${body}\n`, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
};
