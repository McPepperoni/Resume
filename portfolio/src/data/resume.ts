export type MetricTone = 'mint' | 'blue' | 'red' | 'amber';

export type Metric = {
	value: string;
	count?: number;
	suffix?: string;
	label: string;
	detail: string;
	tone: MetricTone;
	iconKey?: string;
	monogram?: string;
};

export type BrandMark = {
	imageSrc?: string;
	iconKey?: string;
	monogram: string;
	tone?: MetricTone;
};

export type Experience = {
	company: string;
	role: string;
	period: string;
	summary: string;
	metrics: string[];
	stack: string[];
	achievements: string[];
	icon: BrandMark;
};

export type Project = {
	name: string;
	type: string;
	href?: string;
	summary: string;
	stack: string[];
	points: string[];
	icon: BrandMark;
};

export type SkillGroup = {
	title: string;
	skills: string[];
	tone: MetricTone;
	icon: BrandMark;
};

export type ContactLink = {
	label: string;
	href: string;
	display: string;
	icon: BrandMark;
};

export type EducationProfile = {
	institution: string;
	degree: string;
	location: string;
	certificates: string[];
};

export const profile = {
	name: 'Nguyen Phu Quang',
	role: 'Software Engineer - Backend and distributed systems',
	location: 'Ho Chi Minh, Vietnam',
	availability: 'Open to remote',
	email: 'quangnguyen16200@gmail.com',
	phone: '+84 913501314',
	github: 'https://github.com/McPepperoni',
	linkedin: 'https://www.linkedin.com/in/quang-phu-nguyen',
	summary:
		'Backend engineer designing event-driven microservices, high-throughput data pipelines, and migration-heavy servicing workloads for multi-country lending platforms.'
};

export const education: EducationProfile = {
	institution: 'University of Information and Technology, HCMVNU',
	degree: 'B.S. Computer Science',
	location: 'Ho Chi Minh',
	certificates: ['TOEIC 930/990']
};

export const heroMetrics: Metric[] = [
	{
		value: '1M+',
		count: 1,
		suffix: 'M+',
		label: 'records/month',
		detail: 'Partner reporting feeds ingested into PostgreSQL reconciliation flows.',
		tone: 'mint',
		iconKey: 'siPostgresql',
		monogram: 'DB'
	},
	{
		value: '300k',
		count: 300,
		suffix: 'k',
		label: 'accounts migrated',
		detail: 'Legacy loan-book accounts and mandates moved with auditable transfers.',
		tone: 'blue',
		iconKey: 'siSpringboot',
		monogram: 'API'
	},
	{
		value: '99.9%',
		count: 99.9,
		suffix: '%',
		label: 'migration integrity',
		detail: 'Batch-oriented controls for unified servicing.',
		tone: 'amber',
		iconKey: 'siApachekafka',
		monogram: 'OK'
	}
];

export const metrics: Metric[] = [
	...heroMetrics,
	{
		value: '2TB',
		count: 2,
		suffix: 'TB',
		label: 'workloads sustained',
		detail: 'Production REST services tuned for predictable throughput.',
		tone: 'red',
		iconKey: 'siDocker',
		monogram: '2T'
	},
	{
		value: '99%',
		count: 99,
		suffix: '%',
		label: 'uptime',
		detail: 'Reliable distributed services backed by Docker-based deployment.',
		tone: 'mint',
		iconKey: 'siLinux',
		monogram: 'UP'
	},
	{
		value: '20%',
		count: 20,
		suffix: '%',
		label: 'data accuracy lift',
		detail: 'SSR and migration tooling raised operational data accuracy.',
		tone: 'amber',
		iconKey: 'siOracle',
		monogram: '20'
	},
	{
		value: '3',
		count: 3,
		suffix: '',
		label: 'partner integrations',
		detail: 'Collections, fee, and mandate management integrations.',
		tone: 'blue',
		iconKey: 'siSpring',
		monogram: '3X'
	}
];

export const signalNarrative = [
	'API-centric microservices for partner onboarding and expansion.',
	'Event-driven servicing flows across Lambda, SQS, S3, and Step Functions.',
	'Observable production behavior through ELK and CloudWatch signals.',
	'Batch reconciliation designed for auditability, data integrity, and recovery.'
];

export const experiences: Experience[] = [
	{
		company: 'TymeX',
		role: 'Software Engineer',
		period: 'Feb 2025 - Present',
		summary:
			'Designs scalable, event-driven processing for a multi-country lending platform and partner expansion.',
		metrics: ['1M+ records/month', '300k accounts migrated', '99.9% integrity', '3 integrations'],
		stack: [
			'Spring Boot',
			'AWS Lambda',
			'S3',
			'SQS',
			'Step Functions',
			'Terraform',
			'PostgreSQL',
			'ELK'
		],
		achievements: [
			'Built partner data pipelines ingesting reporting feeds into PostgreSQL for reconciliation and analytics.',
			'Delivered integrations across collections, fee, and mandate management.',
			'Migrated legacy loan-book accounts and mandates through auditable batch transfers.',
			'Curated safe AI-assisted development conventions across IDE assistants, reviews, and documentation.'
		],
		icon: { imageSrc: '/TX_RGB_Secondary_onWhite.png', monogram: 'TX', tone: 'mint' }
	},
	{
		company: 'Renesas Electronics',
		role: 'Software Engineer',
		period: 'Aug 2023 - Feb 2025',
		summary:
			'Owned production REST services in a distributed microservice landscape for license monitoring and audit.',
		metrics: ['2TB workloads', '99% uptime', '20% data accuracy lift'],
		stack: ['REST APIs', 'RBAC', 'Apache Kafka', 'Camunda BPMN', 'Docker', 'SSR'],
		achievements: [
			'Built RBAC-backed REST APIs for monitoring, audit, and operational visibility.',
			'Used Kafka and Camunda BPMN for reliable asynchronous orchestration.',
			'Rolled out SSR and migration tooling that raised data accuracy by 20%.',
			'Tuned Docker-based services for predictable throughput under large workloads.'
		],
		icon: { imageSrc: '/renesas.png', monogram: 'RE', tone: 'blue' }
	},
	{
		company: 'Success Software Services',
		role: 'Software Engineer',
		period: 'Apr 2023 - Jul 2023',
		summary:
			'Shipped enterprise features across UI, APIs, schemas, and release-ready delivery.',
		metrics: ['E-commerce flows', 'ERP workflows', 'Legacy modernization'],
		stack: ['Next.js', 'Spring Boot', 'RESTful APIs', 'Agile Scrum'],
		achievements: [
			'Delivered end-to-end enterprise features from frontend experience through backend API design.',
			'Built REST APIs and data layers supporting e-commerce and ERP workflows.',
			'Modernized legacy paths while preserving stability and scalability.'
		],
		icon: { imageSrc: '/1631373112789.jpg', monogram: 'SS', tone: 'amber' }
	}
];

export const projects: Project[] = [
	{
		name: 'RAG and LLMs',
		type: 'Personal project',
		summary:
			'Local experimentation stack for retrieval, preprocessing, synthetic data, and inference tuning.',
		stack: ['Python', 'RAG', 'Embeddings', 'Vector retrieval', 'LLM orchestration'],
		points: [
			'Built ingestion, chunking, embedding retrieval, and vector-store workflows.',
			'Integrated LLM-assisted preprocessing and synthetic data generation.',
			'Tuned prompts and inference flow for local experimentation.'
		],
		icon: { iconKey: 'siPython', monogram: 'AI', tone: 'mint' }
	},
	{
		name: 'Rux',
		type: 'Open source',
		href: 'https://github.com/nghien-ot/rux',
		summary:
			'Declarative type-safe HTTP client for TypeScript with zero runtime dependencies.',
		stack: ['TypeScript', 'Schema validation', 'Vitest', 'GitHub Actions'],
		points: [
			'Designed typed path params and request/response validation.',
			'Kept runtime dependency surface at zero.',
			'Backed behavior with Vitest tests and CI.'
		],
		icon: { iconKey: 'siTypescript', monogram: 'TS', tone: 'blue' }
	}
];

export const skillGroups: SkillGroup[] = [
	{
		title: 'Backend systems',
		tone: 'mint',
		skills: ['Microservices', 'Event-driven architecture', 'RESTful APIs', 'Spring Boot'],
		icon: { iconKey: 'siSpringboot', monogram: 'API', tone: 'mint' }
	},
	{
		title: 'Cloud and AWS',
		tone: 'blue',
		skills: ['Lambda', 'S3', 'SQS', 'Step Functions', 'IAM', 'CloudWatch'],
		icon: { monogram: 'AWS', tone: 'blue' }
	},
	{
		title: 'Data stores',
		tone: 'amber',
		skills: ['PostgreSQL', 'MySQL', 'Oracle DB', 'Reconciliation', 'Analytics'],
		icon: { iconKey: 'siPostgresql', monogram: 'SQL', tone: 'amber' }
	},
	{
		title: 'Frontend technology',
		tone: 'blue',
		skills: ['Next.js', 'Astro', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Responsive UI'],
		icon: { iconKey: 'siAstro', monogram: 'UI', tone: 'blue' }
	},
	{
		title: 'Messaging and orchestration',
		tone: 'red',
		skills: ['Apache Kafka', 'AWS SQS', 'Camunda BPMN', 'Async processing'],
		icon: { iconKey: 'siApachekafka', monogram: 'MQ', tone: 'red' }
	},
	{
		title: 'DevOps and delivery',
		tone: 'blue',
		skills: ['Terraform', 'Bash', 'Docker', 'Linux', 'NGINX', 'Kong Gateway', 'ELK'],
		icon: { iconKey: 'siTerraform', monogram: 'OPS', tone: 'blue' }
	},
	{
		title: 'Applied ML',
		tone: 'mint',
		skills: ['RAG', 'Embeddings', 'Vector retrieval', 'Synthetic data', 'LLM orchestration'],
		icon: { iconKey: 'siPython', monogram: 'ML', tone: 'mint' }
	}
];

export const contacts: ContactLink[] = [
	{
		label: 'Email',
		href: `mailto:${profile.email}`,
		display: profile.email,
		icon: { iconKey: 'siGmail', monogram: 'EM', tone: 'red' }
	},
	{
		label: 'GitHub',
		href: profile.github,
		display: 'github.com/McPepperoni',
		icon: { iconKey: 'siGithub', monogram: 'GH', tone: 'mint' }
	},
	{
		label: 'LinkedIn',
		href: profile.linkedin,
		display: 'linkedin.com/in/quang-phu-nguyen',
		icon: { monogram: 'IN', tone: 'blue' }
	}
];

export const techIconMap: Record<string, BrandMark> = {
	'Spring Boot': { iconKey: 'siSpringboot', monogram: 'SB', tone: 'mint' },
	Spring: { iconKey: 'siSpring', monogram: 'SP', tone: 'mint' },
	'AWS Lambda': { monogram: 'LAM', tone: 'blue' },
	Lambda: { monogram: 'LAM', tone: 'blue' },
	S3: { monogram: 'S3', tone: 'blue' },
	SQS: { monogram: 'SQS', tone: 'blue' },
	'Step Functions': { monogram: 'SF', tone: 'blue' },
	IAM: { monogram: 'IAM', tone: 'blue' },
	CloudWatch: { monogram: 'CW', tone: 'blue' },
	Terraform: { iconKey: 'siTerraform', monogram: 'TF', tone: 'blue' },
	PostgreSQL: { iconKey: 'siPostgresql', monogram: 'PG', tone: 'amber' },
	MySQL: { iconKey: 'siMysql', monogram: 'MY', tone: 'amber' },
	'Oracle DB': { monogram: 'ORA', tone: 'amber' },
	ELK: { iconKey: 'siElasticstack', monogram: 'ELK', tone: 'amber' },
	'REST APIs': { monogram: 'API', tone: 'mint' },
	'RESTful APIs': { monogram: 'API', tone: 'mint' },
	RBAC: { monogram: 'RBAC', tone: 'red' },
	'Apache Kafka': { iconKey: 'siApachekafka', monogram: 'KF', tone: 'red' },
	'AWS SQS': { monogram: 'SQS', tone: 'blue' },
	'Camunda BPMN': { iconKey: 'siCamunda', monogram: 'CM', tone: 'red' },
	Docker: { iconKey: 'siDocker', monogram: 'DK', tone: 'blue' },
	SSR: { monogram: 'SSR', tone: 'amber' },
	'Next.js': { iconKey: 'siNextdotjs', monogram: 'NX', tone: 'mint' },
	Astro: { iconKey: 'siAstro', monogram: 'AS', tone: 'blue' },
	React: { iconKey: 'siReact', monogram: 'RX', tone: 'blue' },
	'Tailwind CSS': { iconKey: 'siTailwindcss', monogram: 'TW', tone: 'blue' },
	GSAP: { iconKey: 'siGsap', monogram: 'GS', tone: 'mint' },
	'Responsive UI': { monogram: 'RWD', tone: 'amber' },
	'Agile Scrum': { monogram: 'AG', tone: 'blue' },
	Python: { iconKey: 'siPython', monogram: 'PY', tone: 'mint' },
	RAG: { monogram: 'RAG', tone: 'mint' },
	Embeddings: { monogram: 'EMB', tone: 'mint' },
	'Vector retrieval': { monogram: 'VEC', tone: 'mint' },
	'LLM orchestration': { monogram: 'LLM', tone: 'mint' },
	TypeScript: { iconKey: 'siTypescript', monogram: 'TS', tone: 'blue' },
	'Schema validation': { monogram: 'CHK', tone: 'amber' },
	Vitest: { iconKey: 'siVitest', monogram: 'VT', tone: 'mint' },
	'GitHub Actions': { iconKey: 'siGithubactions', monogram: 'CI', tone: 'blue' },
	Microservices: { monogram: 'MS', tone: 'mint' },
	'Event-driven architecture': { iconKey: 'siApachekafka', monogram: 'EDA', tone: 'red' },
	Linux: { iconKey: 'siLinux', monogram: 'LN', tone: 'blue' },
	Bash: { iconKey: 'siGnubash', monogram: 'SH', tone: 'mint' },
	NGINX: { iconKey: 'siNginx', monogram: 'NX', tone: 'blue' },
	'Kong Gateway': { iconKey: 'siKong', monogram: 'KG', tone: 'blue' },
	Reconciliation: { monogram: 'REC', tone: 'amber' },
	Analytics: { monogram: 'AN', tone: 'amber' },
	'Async processing': { iconKey: 'siApachekafka', monogram: 'ASY', tone: 'red' },
	'Synthetic data': { monogram: 'SYN', tone: 'mint' }
};
