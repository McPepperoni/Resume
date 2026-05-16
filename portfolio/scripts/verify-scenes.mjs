import { existsSync, readFileSync } from 'node:fs';

const readOptional = (path) => (existsSync(path) ? readFileSync(path, 'utf8') : '');

const files = {
	page: readFileSync('src/pages/index.astro', 'utf8'),
	story: readOptional('src/components/PortfolioStory.astro'),
	seoHead: readOptional('src/components/SeoHead.astro'),
	css: readFileSync('src/styles/global.css', 'utf8'),
	motion: readFileSync('src/scripts/scrollStory.ts', 'utf8'),
	data: readFileSync('src/data/resume.ts', 'utf8'),
	seoData: readOptional('src/data/seo.ts'),
	scenePage: readOptional('src/pages/[scene].astro'),
	robots: readOptional('src/pages/robots.txt.ts'),
	llms: readOptional('public/llms.txt'),
	llm: readOptional('public/llm.txt'),
	ogScript: readOptional('scripts/generate-og.mjs'),
	config: readFileSync('astro.config.mjs', 'utf8'),
	brandIcon: readOptional('src/components/BrandIcon.astro'),
	package: readFileSync('package.json', 'utf8')
};

const failures = [];
const requireMatch = (name, source, pattern) => {
	if (!pattern.test(source)) failures.push(name);
};

if (existsSync('AGENTS.original.md')) {
	failures.push('AGENTS.original.md should be removed');
}

if (existsSync('CLAUDE.original.md')) {
	failures.push('CLAUDE.original.md should be removed');
}

const storySource = `${files.page}\n${files.story}`;
const routeSource = `${files.seoData}\n${files.story}`;
const sceneMatches = storySource.match(/<section[^>]*data-scene\b/g) ?? [];
const storySceneMatches = storySource.match(/<section[^>]*data-story-scene\b/g) ?? [];
const sceneMetadataMatches = files.seoData.match(/sceneId:\s*'/g) ?? [];
const introBeatMatches = storySource.match(/data-intro-beat/g) ?? [];
const chapterMatches = storySource.match(/data-chapter/g) ?? [];
const sceneRouteMatches = storySource.match(/data-scene-route/g) ?? [];
const timelineTargetMatches = storySource.match(/data-timeline-link/g) ?? [];
const routeLinkMatches = storySource.match(/data-route-link/g) ?? [];
const pinMatches = files.motion.match(/pin:\s*true/g) ?? [];

if (sceneMatches.length !== 12) {
	failures.push(`expected 12 full-screen scenes, found ${sceneMatches.length}`);
}

if (storySceneMatches.length !== 12) {
	failures.push(`expected 12 layered story scenes, found ${storySceneMatches.length}`);
}

if (introBeatMatches.length !== 0) {
	failures.push(`expected zero intro beats, found ${introBeatMatches.length}`);
}

if (chapterMatches.length < 8) {
	failures.push(`expected at least 8 data-chapter markers, found ${chapterMatches.length}`);
}

if (pinMatches.length !== 1) {
	failures.push(`expected exactly one pinned ScrollTrigger, found ${pinMatches.length}`);
}

if (sceneRouteMatches.length !== 12) {
	failures.push(`expected 12 route-backed scene markers, found ${sceneRouteMatches.length}`);
}

if (sceneMetadataMatches.length !== 12) {
	failures.push(`expected 12 SEO scene metadata entries, found ${sceneMetadataMatches.length}`);
}

if (timelineTargetMatches.length < 1) {
	failures.push(`expected detailed timeline anchors, found ${timelineTargetMatches.length}`);
}

if (routeLinkMatches.length < 3) {
	failures.push(`expected route-backed nav/timeline links, found ${routeLinkMatches.length}`);
}

if (/nav-sigil|class="footer"|<footer\b/.test(storySource) || /\.nav-sigil|\.footer\b/.test(files.css)) {
	failures.push('removed header/hero avatar or footer markup/styles found');
}

requireMatch('intro scene missing', storySource, /id="intro"[\s\S]*data-chapter="intro"/);
requireMatch('intro nav item missing', routeSource, /chapter:\s*'intro'/);
requireMatch('AI flow nav item missing', routeSource, /chapter:\s*'ai-flow'/);
requireMatch('AI flow scene missing', storySource, /id="ai-flow"[\s\S]*data-chapter="ai-flow"/);
if (/label:\s*'Metrics'/.test(routeSource)) {
	failures.push('Metrics nav item should be removed');
}
requireMatch('master story pin missing', storySource, /data-story-pin/);
requireMatch('master story stage missing', storySource, /data-story-stage/);
requireMatch('right-side story timeline missing', storySource, /data-story-timeline/);
requireMatch('timeline progress rail missing', storySource, /data-timeline-progress/);
requireMatch('TymeX metric scene should belong to experience chapter', storySource, /id="metrics"[\s\S]*data-chapter="experience"/);
requireMatch('Renesas metric scene should belong to experience chapter', storySource, /id="metrics-renesas"[\s\S]*data-chapter="experience"/);
requireMatch('second skill scene missing', storySource, /id="skills-delivery"[\s\S]*data-chapter="skills"/);
requireMatch('brand icon component usage missing', storySource, /BrandIcon/);
requireMatch('icon key data missing', files.data, /iconKey/);
requireMatch('Renesas accuracy metric missing', files.data, /20%\s*data accuracy lift|data accuracy lift/);
requireMatch('simple-icons dependency missing', files.package, /"simple-icons"/);
requireMatch('brand icon component missing', files.brandIcon, /simple-icons/);
requireMatch('brand icon image support missing', files.brandIcon, /imageSrc/);
requireMatch('square logo plate CSS missing', files.css, /\.brand-icon-image-backed[\s\S]*aspect-ratio:\s*1/);
requireMatch('TymeX logo asset missing', files.data, /TX_RGB_Secondary_onWhite\.png/);
requireMatch('Renesas logo asset missing', files.data, /renesas\.png/);
requireMatch('Success Software logo asset missing', files.data, /1631373112789\.jpg/);
requireMatch('Claude provider logo missing', storySource, /Claude_AI_logo\.svg\.png/);
requireMatch('Codex provider logo missing', storySource, /codex-app\.png/);
requireMatch('Cursor provider logo missing', storySource, /cursor\.webp/);
requireMatch('scene CSS class missing', files.css, /\.scene\s*\{/);
requireMatch('scene min-height missing', files.css, /\.scene[\s\S]*min-height:\s*100svh/);
requireMatch('story stage CSS missing', files.css, /\.story-stage\s*\{/);
requireMatch('fixed story background missing', files.css, /\.story-stage::before/);
requireMatch('brand icon CSS missing', files.css, /\.brand-icon/);
requireMatch('scene stage missing', files.css, /\.scene-stage\s*\{/);
requireMatch('scene inner overflow guard missing', files.css, /overflow:\s*(auto|hidden)/);
requireMatch('GSAP scene query missing', files.motion, /querySelectorAll<HTMLElement>\('\[data-scene\]'\)/);
requireMatch('GSAP story stage query missing', files.motion, /querySelector<HTMLElement>\('\[data-story-stage\]'\)/);
requireMatch('ScrollTrigger pin missing', files.motion, /pin:\s*true/);
requireMatch('master timeline missing', files.motion, /masterTimeline/);
requireMatch('component reveal registry missing', files.motion, /animateSceneComponents/);
requireMatch('text reveal preparation missing', files.motion, /prepareTextReveals/);
requireMatch('line-mask safe word class missing', files.motion, /reveal-line-word/);
requireMatch('grid container reveal missing', files.motion, /stableGrids[\s\S]*timeline\.set/);
requireMatch('copy-fade animation missing', files.motion, /animateCopyFade[\s\S]*copy-fade/);
requireMatch('metric-sweep animation missing', files.motion, /metricGrids[\s\S]*metricChildren/);
requireMatch('split skill wave animation missing', files.motion, /skill-wave-left[\s\S]*skill-wave-right/);
requireMatch('contact-rise animation missing', files.motion, /contactGrids[\s\S]*contactChildren/);
requireMatch('logo-flow animation missing', files.motion, /logoFlows[\s\S]*logoFlowChildren/);
requireMatch('icon rail container reveal missing', files.motion, /iconRails[\s\S]*timeline\.set/);
requireMatch('chip container reveal missing', files.motion, /chipContainers[\s\S]*timeline\.set/);
requireMatch('button group reveal missing', files.motion, /buttonGroups[\s\S]*timeline\.set/);
requireMatch('counter sweep animation missing', files.motion, /animateCounters[\s\S]*counter-sweep/);
requireMatch('scene ready labels missing', files.motion, /sceneReadyLabel/);
requireMatch('label-based scene progress missing', files.motion, /sceneProgress\(sceneIndex\)/);
requireMatch('timeline active scene mapping missing', files.motion, /sceneIndexFromTimeline/);
requireMatch('chapter nav update missing', files.motion, /data-chapter/);
requireMatch('timeline link active state missing', files.motion, /data-timeline-link[\s\S]*aria-current/);
requireMatch('timeline progress update missing', files.motion, /setTimelineFill[\s\S]*timelineProgress/);
requireMatch('route link setup missing', files.motion, /pushState[\s\S]*data-route-link|data-route-link[\s\S]*pushSceneRoute/);
requireMatch('initial scene setup missing', files.motion, /data-initial-scene|initialScene/);
requireMatch('popstate route handling missing', files.motion, /popstate[\s\S]*scrollToScene/);
requireMatch('reduced motion fallback missing', files.motion, /prefers-reduced-motion:\s*reduce/);
requireMatch('line-mask CSS missing', files.css, /\.reveal-line-word/);
requireMatch('four-up TymeX metric CSS missing', files.css, /\.metric-grid-four[\s\S]*grid-template-columns/);
requireMatch('contact copy CSS missing', files.css, /\.contact-copy[\s\S]*word-spacing:\s*0/);
requireMatch('AI flow CSS missing', files.css, /\.ai-flow-frame[\s\S]*grid-template-columns/);
requireMatch('company title cutoff guard missing', files.css, /\.company-plate h2[\s\S]*line-height:\s*1\.08/);
requireMatch('story timeline CSS missing', files.css, /\.story-timeline\s*\{[\s\S]*right:/);
requireMatch('timeline active CSS missing', files.css, /\.timeline-anchor\.is-active/);
requireMatch('timeline dot markup missing', storySource, /class="timeline-dot"/);
requireMatch('timeline dot CSS missing', files.css, /\.timeline-dot[\s\S]*border-radius:\s*50%/);
requireMatch('timeline label markup missing', storySource, /class="timeline-label"/);
requireMatch('active timeline label CSS missing', files.css, /\.timeline-anchor\.is-active \.timeline-label[\s\S]*opacity:\s*1/);
requireMatch('hover timeline label CSS missing', files.css, /\.timeline-anchor:hover \.timeline-label[\s\S]*opacity:\s*1/);
if (/story-timeline-heading|class="timeline-copy"|class="timeline-index"/.test(storySource)) {
	failures.push('text-heavy timeline markup should not return');
}
requireMatch('share icon import missing', storySource, /Share2/);
requireMatch('share button markup missing', storySource, /data-share-button[\s\S]*aria-label="Copy current screen link"/);
requireMatch('share label markup missing', storySource, /class="share-label"[\s\S]*Share/);
requireMatch('share toast markup missing', storySource, /data-share-toast[\s\S]*aria-live="polite"/);
requireMatch('share control CSS missing', files.css, /\.share-control[\s\S]*bottom:/);
requireMatch('share square button CSS missing', files.css, /\.share-control\s*\{[\s\S]*justify-content:\s*center[\s\S]*width:\s*46px[\s\S]*height:\s*46px/);
requireMatch('share hover label CSS missing', files.css, /\.share-control:hover \.share-label[\s\S]*opacity:\s*1/);
requireMatch('share toast visible CSS missing', files.css, /\.share-toast\.is-visible[\s\S]*opacity:\s*1/);
requireMatch('share toast centered bottom CSS missing', files.css, /\.share-toast\s*\{[\s\S]*position:\s*fixed[\s\S]*left:\s*50%[\s\S]*bottom:/);
requireMatch('share reduced motion CSS missing', files.css, /prefers-reduced-motion:\s*reduce[\s\S]*\.share-control/);
requireMatch('share setup missing', files.motion, /setupShareButton/);
requireMatch('share route copy missing', files.motion, /data-scene-route[\s\S]*navigator\.clipboard\.writeText|navigator\.clipboard\.writeText[\s\S]*data-scene-route/);
requireMatch('share fallback copy missing', files.motion, /execCommand\('copy'\)/);
requireMatch('share success toast missing', files.motion, /Copied screen link/);
requireMatch('share failure toast missing', files.motion, /Copy failed/);

requireMatch('SITE_URL config missing', files.config, /SITE_URL[\s\S]*localhost:4321/);
requireMatch('SEO scene metadata missing', files.seoData, /sceneSeoItems[\s\S]*route[\s\S]*sceneId[\s\S]*ogImage/);
requireMatch('all SEO routes missing', files.seoData, /\/ai-flow\/[\s\S]*\/experience\/[\s\S]*\/tymex-metrics\/[\s\S]*\/renesas\/[\s\S]*\/renesas-metrics\/[\s\S]*\/success\/[\s\S]*\/rag-llm\/[\s\S]*\/rux\/[\s\S]*\/skills\/[\s\S]*\/skills-delivery\/[\s\S]*\/contact\//);
requireMatch('SEO head component missing', files.seoHead, /og:title[\s\S]*twitter:card[\s\S]*application\/ld\+json/);
requireMatch('index should use SEO head', files.page, /<SeoHead/);
requireMatch('index should use reusable story', files.page, /<PortfolioStory/);
requireMatch('dynamic scene route missing', files.scenePage, /getStaticPaths[\s\S]*routedSceneSeoItems[\s\S]*<PortfolioStory/);
requireMatch('robots endpoint missing', files.robots, /User-agent:\s*\*[\s\S]*Sitemap:/);
requireMatch('llms.txt missing portfolio summary', files.llms, /# Nguyen Phu Quang[\s\S]*## Key Pages/);
requireMatch('llm.txt compatibility pointer missing', files.llm, /llms\.txt/);
requireMatch('OG generator missing', files.ogScript, /sceneSeoItems[\s\S]*ogImage[\s\S]*PNG/);
requireMatch('prebuild OG generation missing', files.package, /"prebuild":\s*"node scripts\/generate-og\.mjs"/);

const expectedOrder = [
	'id="intro"',
	'id="ai-flow"',
	'id="experience"',
	'id="metrics"',
	'id="experience-renesas"',
	'id="metrics-renesas"',
	'id="experience-success"',
	'id="projects"',
	'id="project-rux"',
	'id="skills"',
	'id="skills-delivery"',
	'id="contact"'
];
let cursor = -1;
for (const token of expectedOrder) {
	const next = storySource.indexOf(token, cursor + 1);
	if (next === -1) {
		failures.push(`story order token missing: ${token}`);
		break;
	}
	if (next < cursor) {
		failures.push(`story order is wrong around: ${token}`);
		break;
	}
	cursor = next;
}

const contactSection = storySource.match(/<section[^>]*id="contact"[\s\S]*?<\/section>/)?.[0] ?? '';
if (/data-reveal="word-rise"/.test(contactSection)) {
	failures.push('contact section still uses word-rise reveal');
}

const revealSource = `${storySource}\n${files.brandIcon}`;
for (const reveal of [
	'line-mask',
	'word-rise',
	'copy-fade',
	'char-scan',
	'card-lift',
	'border-trace',
	'icon-pop',
	'chip-cascade',
	'counter-sweep',
	'metric-sweep',
	'skill-wave-left',
	'skill-wave-right',
	'contact-rise',
	'project-terminal',
	'logo-flow'
]) {
	requireMatch(`component reveal missing: ${reveal}`, revealSource, new RegExp(`data-reveal(?:=|=\\{)["']?${reveal}`));
}

const forbiddenSceneMotion = [
	/getTransitionIn/,
	/transformPerspective/,
	/data-scene-wipe/,
	/data-transition/,
	/preserve-3d/,
	/reveal-word\s+reveal-word-measure/,
	/rotate[XY]\s*:/,
	/\bz:\s*-?\d+/,
	/\bscale:\s*0\.\d+/
];

for (const pattern of forbiddenSceneMotion) {
	if (pattern.test(files.motion) || pattern.test(storySource)) {
		failures.push(`whole-scene transition residue found: ${pattern}`);
	}
}

const forbiddenTokens = [
	'grad' + 'ient',
	'linear-' + 'grad' + 'ient',
	'radial-' + 'grad' + 'ient',
	'world' + 'quant'
];
for (const [name, source] of Object.entries(files)) {
	const normalized = source.toLowerCase();
	if (forbiddenTokens.some((token) => normalized.includes(token))) {
		failures.push(`forbidden visual reference in ${name}`);
	}
}

if (failures.length) {
	console.error(failures.join('\n'));
	process.exit(1);
}

console.log('Scene architecture verified.');
