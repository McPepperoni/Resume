import { profile } from './resume.ts';

export type SceneSeo = {
	sceneId: string;
	slug: string;
	route: string;
	chapter: 'intro' | 'ai-flow' | 'experience' | 'projects' | 'skills' | 'contact';
	label: string;
	detail: string;
	title: string;
	description: string;
	keywords: string[];
	ogImage: string;
};

const baseKeywords = [
	'Nguyen Phu Quang',
	'backend engineer',
	'distributed systems',
	'Spring Boot',
	'AWS',
	'data pipelines',
	'AI-assisted development'
];

export const sceneSeoItems: SceneSeo[] = [
	{
		sceneId: 'intro',
		slug: '',
		route: '/',
		chapter: 'intro',
		label: 'Intro',
		detail: 'Command deck',
		title: `${profile.name} | Backend and Distributed Systems Engineer`,
		description:
			'Portfolio for Nguyen Phu Quang, a backend engineer building distributed systems, lending pipelines, integrations, and observable data-heavy services.',
		keywords: baseKeywords,
		ogImage: '/og/intro.png'
	},
	{
		sceneId: 'ai-flow',
		slug: 'ai-flow',
		route: '/ai-flow/',
		chapter: 'ai-flow',
		label: 'AI Flow',
		detail: 'Assistant loop',
		title: `AI-Centric Development Flow | ${profile.name}`,
		description:
			'How Quang uses AI assistants inside an engineering loop grounded in code context, typed boundaries, tests, and production judgment.',
		keywords: [...baseKeywords, 'Codex', 'Claude', 'Cursor', 'AI engineering workflow'],
		ogImage: '/og/ai-flow.png'
	},
	{
		sceneId: 'experience',
		slug: 'experience',
		route: '/experience/',
		chapter: 'experience',
		label: 'TymeX',
		detail: 'Lending systems',
		title: `TymeX Experience | ${profile.name}`,
		description:
			'TymeX experience building event-driven lending systems, partner integrations, reconciliation pipelines, and migration-heavy servicing workloads.',
		keywords: [...baseKeywords, 'TymeX', 'lending platform', 'partner integrations'],
		ogImage: '/og/experience.png'
	},
	{
		sceneId: 'metrics',
		slug: 'tymex-metrics',
		route: '/tymex-metrics/',
		chapter: 'experience',
		label: 'TymeX Metrics',
		detail: 'Scale and integrity',
		title: `TymeX Metrics | ${profile.name}`,
		description:
			'Impact metrics from TymeX work: 1M+ records per month, 300k accounts migrated, 99.9% integrity, and partner integrations.',
		keywords: [...baseKeywords, '1M records', '300k accounts', 'migration integrity'],
		ogImage: '/og/tymex-metrics.png'
	},
	{
		sceneId: 'experience-renesas',
		slug: 'renesas',
		route: '/renesas/',
		chapter: 'experience',
		label: 'Renesas',
		detail: 'Data operations',
		title: `Renesas Electronics Experience | ${profile.name}`,
		description:
			'Renesas Electronics experience owning REST services, audit visibility, Kafka orchestration, Camunda BPMN flows, and Docker-based workloads.',
		keywords: [...baseKeywords, 'Renesas Electronics', 'Kafka', 'Camunda BPMN', 'Docker'],
		ogImage: '/og/renesas.png'
	},
	{
		sceneId: 'metrics-renesas',
		slug: 'renesas-metrics',
		route: '/renesas-metrics/',
		chapter: 'experience',
		label: 'Renesas Metrics',
		detail: 'Reliability lift',
		title: `Renesas Reliability Metrics | ${profile.name}`,
		description:
			'Renesas impact metrics covering 2TB workloads, 99% uptime, and a 20% data accuracy lift through migration and SSR tooling.',
		keywords: [...baseKeywords, '2TB workloads', '99% uptime', 'data accuracy lift'],
		ogImage: '/og/renesas-metrics.png'
	},
	{
		sceneId: 'experience-success',
		slug: 'success',
		route: '/success/',
		chapter: 'experience',
		label: 'Success',
		detail: 'Platform delivery',
		title: `Success Software Services Experience | ${profile.name}`,
		description:
			'Success Software Services experience shipping enterprise features across frontend UI, backend APIs, schemas, and release-ready delivery.',
		keywords: [...baseKeywords, 'Success Software Services', 'Next.js', 'REST APIs'],
		ogImage: '/og/success.png'
	},
	{
		sceneId: 'projects',
		slug: 'rag-llm',
		route: '/rag-llm/',
		chapter: 'projects',
		label: 'RAG/LLM',
		detail: 'Retrieval pipeline',
		title: `RAG and LLM Project | ${profile.name}`,
		description:
			'RAG and LLM experimentation with ingestion, chunking, embeddings, vector retrieval, synthetic data, and local inference tuning.',
		keywords: [...baseKeywords, 'RAG', 'LLM', 'embeddings', 'vector retrieval'],
		ogImage: '/og/rag-llm.png'
	},
	{
		sceneId: 'project-rux',
		slug: 'rux',
		route: '/rux/',
		chapter: 'projects',
		label: 'Rux',
		detail: 'HTTP client',
		title: `Rux Type-Safe HTTP Client | ${profile.name}`,
		description:
			'Rux is a declarative type-safe HTTP client for TypeScript with typed params, validation, tests, and zero runtime dependencies.',
		keywords: [...baseKeywords, 'Rux', 'TypeScript', 'HTTP client', 'open source'],
		ogImage: '/og/rux.png'
	},
	{
		sceneId: 'skills',
		slug: 'skills',
		route: '/skills/',
		chapter: 'skills',
		label: 'Skills 01',
		detail: 'Systems base',
		title: `Backend, Cloud, and Data Skills | ${profile.name}`,
		description:
			'Backend systems, cloud and AWS, and data-store skills grouped for backend and distributed-systems recruiters.',
		keywords: [...baseKeywords, 'microservices', 'AWS Lambda', 'PostgreSQL', 'Oracle DB'],
		ogImage: '/og/skills.png'
	},
	{
		sceneId: 'skills-delivery',
		slug: 'skills-delivery',
		route: '/skills-delivery/',
		chapter: 'skills',
		label: 'Skills 02',
		detail: 'Frontend delivery',
		title: `Frontend, Delivery, and Applied ML Skills | ${profile.name}`,
		description:
			'Frontend, messaging, DevOps, delivery, and applied ML skills across Next.js, Astro, React, Tailwind CSS, GSAP, Kafka, Terraform, Docker, RAG, and embeddings.',
		keywords: [
			...baseKeywords,
			'Next.js',
			'Astro',
			'React',
			'Tailwind CSS',
			'GSAP',
			'Kafka',
			'Terraform',
			'Docker',
			'RAG',
			'DevOps'
		],
		ogImage: '/og/skills-delivery.png'
	},
	{
		sceneId: 'contact',
		slug: 'contact',
		route: '/contact/',
		chapter: 'contact',
		label: 'Contact',
		detail: 'Dock links',
		title: `Contact ${profile.name} | Backend Engineer`,
		description:
			'Contact Nguyen Phu Quang for remote backend, platform, distributed systems, integrations, cloud, and data-heavy product work.',
		keywords: [...baseKeywords, 'contact', 'remote backend engineer', 'Vietnam software engineer'],
		ogImage: '/og/contact.png'
	}
];

export const introSceneSeo = sceneSeoItems[0];
export const routedSceneSeoItems = sceneSeoItems.filter((scene) => scene.route !== '/');
export const sceneSeoById = Object.fromEntries(
	sceneSeoItems.map((scene) => [scene.sceneId, scene])
) as Record<string, SceneSeo>;
export const sceneSeoByRoute = Object.fromEntries(
	sceneSeoItems.map((scene) => [scene.route, scene])
) as Record<string, SceneSeo>;

export const navItems = [
	{ label: 'Intro', scene: sceneSeoById.intro },
	{ label: 'AI Flow', scene: sceneSeoById['ai-flow'] },
	{ label: 'Experience', scene: sceneSeoById.experience },
	{ label: 'Projects', scene: sceneSeoById.projects },
	{ label: 'Skills', scene: sceneSeoById.skills },
	{ label: 'Contact', scene: sceneSeoById.contact }
].map(({ label, scene }) => ({ label, route: scene.route, chapter: scene.chapter, sceneId: scene.sceneId }));

export const timelineItems = sceneSeoItems.map(({ label, detail, route, chapter, sceneId }) => ({
	label,
	detail,
	route,
	chapter,
	sceneId
}));

export const resolveSiteUrl = (site?: URL | string | null) => {
	if (site instanceof URL) return site;
	return new URL(site ?? import.meta.env.SITE_URL ?? 'http://localhost:4321');
};

export const absoluteUrl = (path: string, site?: URL | string | null) =>
	new URL(path, resolveSiteUrl(site)).toString();
