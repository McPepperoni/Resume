import '../styles/global.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const documentElement = document.documentElement;
const storyRoot = document.querySelector<HTMLElement>('[data-story-root]');
const storyPin = document.querySelector<HTMLElement>('[data-story-pin]');
const storyStage = document.querySelector<HTMLElement>('[data-story-stage]');
const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
const timelineLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-timeline-link]'));
const timelineProgress = document.querySelector<HTMLElement>('[data-timeline-progress]');
let masterTimeline: gsap.core.Timeline | undefined;
const sceneReadyOffset = 0.72;

const normalizeRoute = (route: string) => {
	const pathname = route.startsWith('http') ? new URL(route).pathname : route;
	if (!pathname || pathname === '/') return '/';
	return pathname.endsWith('/') ? pathname : `${pathname}/`;
};

const sceneRouteMap = new Map<string, string>();
scenes.forEach((scene) => {
	const route = scene.dataset.sceneRoute;
	if (route) sceneRouteMap.set(normalizeRoute(route), `#${scene.id}`);
});

const sceneHashFromRoute = (route = window.location.pathname) => sceneRouteMap.get(normalizeRoute(route));

const currentSceneHash = () => {
	const hash = window.location.hash;
	if (hash && document.querySelector(hash)) return hash;

	const routeHash = sceneHashFromRoute();
	if (routeHash) return routeHash;

	const initialScene = storyRoot?.dataset.initialScene;
	if (initialScene && document.getElementById(initialScene)) return `#${initialScene}`;

	return '#intro';
};

const pushSceneRoute = (scene: HTMLElement, replace = false) => {
	const route = scene.dataset.sceneRoute;
	if (!route || normalizeRoute(window.location.pathname) === normalizeRoute(route)) return;

	const method = replace ? 'replaceState' : 'pushState';
	history[method]({ sceneId: scene.id }, '', route);
};

documentElement.classList.add('motion-ready');

const updateProgress = () => {
	const progressBar = document.querySelector<HTMLElement>('[data-scroll-progress]');
	if (!progressBar) return;

	const maxScroll = documentElement.scrollHeight - window.innerHeight;
	const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
	progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
};

const setTimelineFill = (progress: number) => {
	if (!timelineProgress) return;
	timelineProgress.style.height = `${Math.min(100, Math.max(0, progress * 100))}%`;
};

const setActiveScene = (scene: HTMLElement) => {
	const chapter = scene.getAttribute('data-chapter');
	const sceneIndex = scenes.indexOf(scene);

	scenes.forEach((item) => item.classList.toggle('is-active', item === scene));
	document.querySelectorAll<HTMLElement>('[data-nav-link]').forEach((link) => {
		link.classList.toggle('is-active', link.dataset.navChapter === chapter);
	});
	timelineLinks.forEach((link) => {
		const timelineIndex = Number(link.dataset.timelineIndex ?? '-1');
		const isActive = timelineIndex === sceneIndex;

		link.classList.toggle('is-active', isActive);
		if (isActive) {
			link.setAttribute('aria-current', 'step');
		} else {
			link.removeAttribute('aria-current');
		}
	});

	if (sceneIndex >= 0) {
		setTimelineFill(sceneIndex / Math.max(1, scenes.length - 1));
	}
};

const sceneIndexFromHash = (hash: string) => {
	if (hash === '#top') return 0;

	const target = document.querySelector<HTMLElement>(hash);
	if (!target) return 0;

	const directIndex = scenes.indexOf(target);
	if (directIndex >= 0) return directIndex;

	const chapter = target.dataset.chapter;
	if (!chapter) return 0;

	return Math.max(
		0,
		scenes.findIndex((scene) => scene.dataset.chapter === chapter)
	);
};

const sceneStartLabel = (index: number) => `scene-${index}`;
const sceneReadyLabel = (index: number) => `scene-ready-${index}`;

const sceneProgress = (index: number) => {
	if (!masterTimeline) return 0;

	const labelTime =
		masterTimeline.labels[sceneReadyLabel(index)] ??
		masterTimeline.labels[sceneStartLabel(index)] ??
		index;
	const duration = Math.max(1, masterTimeline.duration());

	return Math.min(1, Math.max(0, labelTime / duration));
};

const sceneIndexFromTimeline = (timeline: gsap.core.Timeline) => {
	const time = timeline.time();
	let activeIndex = 0;

	scenes.forEach((_, index) => {
		const labelTime = timeline.labels[sceneStartLabel(index)];
		if (typeof labelTime === 'number' && time >= labelTime - 0.08) {
			activeIndex = index;
		}
	});

	return activeIndex;
};

const scrollToScene = (hash: string, smooth = true) => {
	if (!storyPin || !masterTimeline) {
		const target = hash === '#top' ? document.body : document.querySelector<HTMLElement>(hash);
		target?.scrollIntoView({ behavior: smooth && !reducedMotion ? 'smooth' : 'auto' });
		return;
	}

	const trigger = ScrollTrigger.getById('master-story');
	const sceneIndex = sceneIndexFromHash(hash);
	const progress = sceneProgress(sceneIndex);
	const start = trigger?.start ?? storyPin.offsetTop;
	const end = trigger?.end ?? start + window.innerHeight * scenes.length;
	const top = start + (end - start) * progress;

	window.scrollTo({ top, behavior: smooth && !reducedMotion ? 'smooth' : 'auto' });
	if (!smooth) {
		[0, 120].forEach((delay) => {
			window.setTimeout(() => {
				ScrollTrigger.update();
				masterTimeline?.progress(progress, false);
				if (scenes[sceneIndex]) setActiveScene(scenes[sceneIndex]);
			}, delay);
		});
	}
	if (scenes[sceneIndex]) setActiveScene(scenes[sceneIndex]);
};

const setupRouteJumps = () => {
	document.querySelectorAll<HTMLAnchorElement>('[data-route-link]').forEach((link) => {
		const sceneTarget = link.dataset.sceneTarget;
		if (!sceneTarget) return;

		link.addEventListener('click', (event) => {
			event.preventDefault();
			const scene = document.getElementById(sceneTarget);
			if (!(scene instanceof HTMLElement)) return;

			pushSceneRoute(scene);
			scrollToScene(`#${sceneTarget}`);
		});
	});
};

const fallbackCopyText = (text: string) => {
	const textarea = document.createElement('textarea');
	textarea.value = text;
	textarea.setAttribute('readonly', '');
	textarea.style.position = 'fixed';
	textarea.style.inset = '0 auto auto 0';
	textarea.style.width = '1px';
	textarea.style.height = '1px';
	textarea.style.opacity = '0';
	document.body.appendChild(textarea);
	textarea.select();
	textarea.setSelectionRange(0, textarea.value.length);

	try {
		const commandDocument = document as unknown as { execCommand(commandId: 'copy'): boolean };
		return commandDocument.execCommand('copy');
	} finally {
		textarea.remove();
	}
};

const copyText = async (text: string) => {
	if (navigator.clipboard?.writeText) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			return fallbackCopyText(text);
		}
	}

	return fallbackCopyText(text);
};

const setupShareButton = () => {
	const shareButton = document.querySelector<HTMLButtonElement>('[data-share-button]');
	const shareToast = document.querySelector<HTMLElement>('[data-share-toast]');
	let toastTimer: number | undefined;

	if (!shareButton || !shareToast) return;

	const showToast = (message: string, isError = false) => {
		window.clearTimeout(toastTimer);
		shareToast.textContent = message;
		shareToast.classList.toggle('is-error', isError);
		shareToast.classList.add('is-visible');
		toastTimer = window.setTimeout(() => {
			shareToast.classList.remove('is-visible', 'is-error');
		}, 1800);
	};

	const getShareUrl = () => {
		const activeScene = document.querySelector<HTMLElement>('[data-scene].is-active');
		const route = activeScene?.getAttribute('data-scene-route');
		return route ? new URL(route, window.location.origin).href : window.location.href;
	};

	shareButton.addEventListener('click', async () => {
		const copied = await copyText(getShareUrl());
		showToast(copied ? 'Copied screen link' : 'Copy failed', !copied);
	});
};

const setupAnchorJumps = () => {
	document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
		const hash = link.getAttribute('href');
		if (!hash || hash === '#') return;

		link.addEventListener('click', (event) => {
			event.preventDefault();
			const sceneIndex = sceneIndexFromHash(hash);
			const scene = scenes[sceneIndex];
			if (scene) pushSceneRoute(scene);
			scrollToScene(hash);
		});
	});
};

const setupChapterObserver = () => {
	if (!('IntersectionObserver' in window)) return;

	const observer = new IntersectionObserver(
		(entries) => {
			const visible = entries
				.filter((entry) => entry.isIntersecting)
				.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

			if (visible?.target instanceof HTMLElement) {
				setActiveScene(visible.target);
			}
		},
		{ threshold: [0.45, 0.65, 0.85] }
	);

	scenes.forEach((scene) => observer.observe(scene));
};

const setupTiltCards = () => {
	const cards = document.querySelectorAll<HTMLElement>('[data-tilt]');

	cards.forEach((card) => {
		card.addEventListener('pointermove', (event) => {
			if (reducedMotion) return;

			const rect = card.getBoundingClientRect();
			const x = (event.clientX - rect.left) / rect.width - 0.5;
			const y = (event.clientY - rect.top) / rect.height - 0.5;

			card.style.setProperty('--tilt-x', `${x * 4}deg`);
			card.style.setProperty('--tilt-y', `${y * -4}deg`);
			card.style.setProperty('--lift', '-2px');
		});

		card.addEventListener('pointerleave', () => {
			card.style.removeProperty('--tilt-x');
			card.style.removeProperty('--tilt-y');
			card.style.removeProperty('--lift');
		});
	});
};

const setupStaticReducedMotion = () => {
	documentElement.classList.add('motion-reduced');
	setupChapterObserver();

	document.querySelectorAll<HTMLElement>('[data-count]').forEach((element) => {
		const target = element.dataset.count ?? '';
		const suffix = element.dataset.suffix ?? '';
		element.textContent = `${target}${suffix}`;
	});
};

const hasElementChildren = (element: HTMLElement) =>
	Array.from(element.childNodes).some((node) => node.nodeType === Node.ELEMENT_NODE);

const createSpan = (className: string, text: string) => {
	const span = document.createElement('span');
	span.className = className;
	span.textContent = text;
	span.setAttribute('aria-hidden', 'true');
	return span;
};

const normalizeInlineText = (text: string) => text.replace(/\s+/g, ' ').trim();

const wrapExistingChildrenAsLine = (element: HTMLElement) => {
	if (element.dataset.revealPrepared === 'true') return;
	const line = document.createElement('span');
	const inner = document.createElement('span');
	line.className = 'reveal-line';
	inner.className = 'reveal-line-inner';

	while (element.firstChild) inner.appendChild(element.firstChild);
	line.appendChild(inner);
	element.appendChild(line);
	element.dataset.revealPrepared = 'true';
};

const splitLineMask = (element: HTMLElement) => {
	if (element.dataset.revealPrepared === 'true') return;
	if (hasElementChildren(element)) {
		wrapExistingChildrenAsLine(element);
		return;
	}

	const text = normalizeInlineText(element.textContent ?? '');
	if (!text) return;

	element.dataset.originalText = text;
	element.setAttribute('aria-label', text);
	element.textContent = '';

	const wordSpans = (text.match(/\S+\s*/g) ?? [text]).map((segment) =>
		createSpan('reveal-line-word reveal-line-measure', segment)
	);
	wordSpans.forEach((span) => element.appendChild(span));

	const groups: HTMLElement[][] = [];
	let previousTop: number | undefined;
	wordSpans.forEach((span) => {
		const top = Math.round(span.offsetTop);
		if (previousTop === undefined || Math.abs(top - previousTop) > 2) {
			groups.push([]);
			previousTop = top;
		}
		groups[groups.length - 1].push(span);
	});

	element.textContent = '';
	groups.forEach((group) => {
		const line = document.createElement('span');
		const inner = document.createElement('span');
		line.className = 'reveal-line';
		inner.className = 'reveal-line-inner';
		group.forEach((span) => {
			span.classList.remove('reveal-line-measure');
			inner.appendChild(span);
		});
		line.appendChild(inner);
		element.appendChild(line);
	});
	element.dataset.revealPrepared = 'true';
};

const splitWordRise = (element: HTMLElement) => {
	if (element.dataset.revealPrepared === 'true' || hasElementChildren(element)) return;
	const text = normalizeInlineText(element.textContent ?? '');
	if (!text) return;

	element.dataset.originalText = text;
	element.setAttribute('aria-label', text);
	element.textContent = '';
	(text.match(/\S+\s*/g) ?? [text]).forEach((segment) => {
		element.appendChild(createSpan('reveal-word', segment));
	});
	element.dataset.revealPrepared = 'true';
};

const splitCharScan = (element: HTMLElement) => {
	if (element.dataset.revealPrepared === 'true' || hasElementChildren(element)) return;
	const text = element.textContent?.trim();
	if (!text) return;

	element.dataset.originalText = text;
	element.setAttribute('aria-label', text);
	element.textContent = '';
	Array.from(text).forEach((char) => {
		element.appendChild(createSpan('reveal-char', char));
	});
	element.dataset.revealPrepared = 'true';
};

const prepareTextReveals = () => {
	document.querySelectorAll<HTMLElement>('[data-reveal="line-mask"]').forEach(splitLineMask);
	document.querySelectorAll<HTMLElement>('[data-reveal="word-rise"]').forEach(splitWordRise);
	document.querySelectorAll<HTMLElement>('[data-reveal="char-scan"]').forEach(splitCharScan);
};

const revealElements = (scene: HTMLElement, reveal: string) =>
	Array.from(scene.querySelectorAll<HTMLElement>(`[data-reveal="${reveal}"]`));

const revealPieces = (scene: HTMLElement) =>
	Array.from(
		scene.querySelectorAll<HTMLElement>(
			'[data-reveal], .reveal-line-inner, .reveal-word, .reveal-char'
		)
	);

const setRevealState = (scene: HTMLElement, visible: boolean) => {
	const visibility = visible ? 1 : 0;
	gsap.set(revealPieces(scene), {
		autoAlpha: visibility,
		x: 0,
		y: 0,
		rotation: 0,
		skewY: 0,
		yPercent: 0,
		clipPath: 'inset(0% 0% 0% 0%)',
		'--trace-x': visible ? 1 : 0,
		'--trace-y': visible ? 1 : 0,
		'--trace-opacity': visibility
	});
};

const staggerFromSide = (index: number) => (index % 2 === 0 ? -18 : 18);

const animateLineMasks = (timeline: gsap.core.Timeline, scene: HTMLElement, at: number) => {
	const elements = revealElements(scene, 'line-mask');
	const lines = elements.flatMap((element) => Array.from(element.querySelectorAll<HTMLElement>('.reveal-line-inner')));
	if (!lines.length) return;

	timeline.set(elements, { autoAlpha: 1 }, at);
	timeline.fromTo(
		lines,
		{ autoAlpha: 0, yPercent: 112, skewY: 4 },
		{ autoAlpha: 1, yPercent: 0, skewY: 0, duration: 0.28, stagger: 0.025, ease: 'power3.out' },
		at
	);
};

const animateWordRise = (timeline: gsap.core.Timeline, scene: HTMLElement, at: number) => {
	const elements = revealElements(scene, 'word-rise');
	if (!elements.length) return;
	const words = elements.flatMap((element) => Array.from(element.querySelectorAll<HTMLElement>('.reveal-word')));
	if (!words.length) {
		timeline.fromTo(elements, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.26, stagger: 0.035 }, at);
		return;
	}

	timeline.set(elements, { autoAlpha: 1 }, at);
	timeline.fromTo(
		words,
		{ autoAlpha: 0, y: 18, clipPath: 'inset(0% 0% 45% 0%)' },
		{ autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.22, stagger: 0.008, ease: 'power2.out' },
		at
	);
};

const animateCopyFade = (timeline: gsap.core.Timeline, scene: HTMLElement, at: number) => {
	const elements = revealElements(scene, 'copy-fade');
	if (!elements.length) return;

	timeline.fromTo(
		elements,
		{ autoAlpha: 0, y: 14, clipPath: 'inset(0% 0% 24% 0%)' },
		{
			autoAlpha: 1,
			y: 0,
			clipPath: 'inset(0% 0% 0% 0%)',
			duration: 0.24,
			stagger: 0.035,
			ease: 'power2.out'
		},
		at
	);
};

const animateCharScan = (timeline: gsap.core.Timeline, scene: HTMLElement, at: number) => {
	const elements = revealElements(scene, 'char-scan');
	if (!elements.length) return;
	const chars = elements.flatMap((element) => Array.from(element.querySelectorAll<HTMLElement>('.reveal-char')));
	if (!chars.length) {
		timeline.fromTo(elements, { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.22, stagger: 0.025 }, at);
		return;
	}

	timeline.set(elements, { autoAlpha: 1 }, at);
	timeline.fromTo(
		chars,
		{ autoAlpha: 0, y: 7, clipPath: 'inset(0% 0% 100% 0%)' },
		{ autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.16, stagger: 0.004, ease: 'steps(5)' },
		at
	);
};

const animateCards = (timeline: gsap.core.Timeline, scene: HTMLElement, at: number) => {
	const lifted = revealElements(scene, 'card-lift');
	const traced = revealElements(scene, 'border-trace');
	const cardGrids = revealElements(scene, 'card-grid');
	const metricGrids = revealElements(scene, 'metric-sweep');
	const contactGrids = revealElements(scene, 'contact-rise');
	const projectTerminals = revealElements(scene, 'project-terminal');
	const logoFlows = revealElements(scene, 'logo-flow');
	const matrixGrids = [
		...revealElements(scene, 'matrix-wave'),
		...revealElements(scene, 'skill-wave-left'),
		...revealElements(scene, 'skill-wave-right')
	];
	const gridChildren = cardGrids.flatMap((element) =>
		Array.from(element.children).filter((child): child is HTMLElement => child instanceof HTMLElement)
	);
	const metricChildren = metricGrids.flatMap((element) =>
		Array.from(element.children).filter((child): child is HTMLElement => child instanceof HTMLElement)
	);
	const contactChildren = contactGrids.flatMap((element) =>
		Array.from(element.children).filter((child): child is HTMLElement => child instanceof HTMLElement)
	);
	const logoFlowChildren = logoFlows.flatMap((element) =>
		Array.from(element.children).filter((child): child is HTMLElement => child instanceof HTMLElement)
	);
	const matrixChildren = matrixGrids.flatMap((element) =>
		Array.from(element.children).filter((child): child is HTMLElement => child instanceof HTMLElement)
	);
	const stableGrids = [
		...cardGrids,
		...metricGrids,
		...contactGrids,
		...projectTerminals,
		...logoFlows,
		...matrixGrids
	];

	if (stableGrids.length) {
		timeline.set(
			stableGrids,
			{ autoAlpha: 1, x: 0, y: 0, rotation: 0, clipPath: 'inset(0% 0% 0% 0%)' },
			at
		);
	}

	if (lifted.length) {
		timeline.fromTo(
			lifted,
			{ autoAlpha: 0, y: 28, clipPath: 'inset(10% 0% 0% 0%)' },
			{ autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.3, stagger: 0.04, ease: 'power2.out' },
			at
		);
	}

	if (traced.length) {
		timeline.fromTo(
			traced,
			{ autoAlpha: 0, y: 20, '--trace-x': 0, '--trace-y': 0, '--trace-opacity': 0 },
			{ autoAlpha: 1, y: 0, '--trace-x': 1, '--trace-y': 1, '--trace-opacity': 1, duration: 0.34, stagger: 0.035, ease: 'power2.out' },
			at + 0.04
		);
	}

	if (gridChildren.length) {
		timeline.fromTo(
			gridChildren,
			{ autoAlpha: 0, y: 24, clipPath: 'inset(16% 0% 0% 0%)' },
			{ autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.28, stagger: 0.045, ease: 'power2.out' },
			at + 0.06
		);
	}

	if (metricChildren.length) {
		timeline.fromTo(
			metricChildren,
			{
				autoAlpha: 0,
				x: (position) => (position % 2 === 0 ? -20 : 20),
				y: 14,
				clipPath: 'inset(0% 0% 18% 0%)'
			},
			{
				autoAlpha: 1,
				x: 0,
				y: 0,
				clipPath: 'inset(0% 0% 0% 0%)',
				duration: 0.3,
				stagger: { each: 0.035, from: 'start' },
				ease: 'power2.out'
			},
			at + 0.06
		);
	}

	if (contactChildren.length) {
		timeline.fromTo(
			contactChildren,
			{
				autoAlpha: 0,
				y: (position) => 28 + position * 6,
				clipPath: 'inset(18% 0% 0% 0%)'
			},
			{
				autoAlpha: 1,
				y: 0,
				clipPath: 'inset(0% 0% 0% 0%)',
				duration: 0.32,
				stagger: 0.055,
				ease: 'power3.out'
			},
			at + 0.08
		);
	}

	if (logoFlowChildren.length) {
		timeline.fromTo(
			logoFlowChildren,
			{
				autoAlpha: 0,
				x: (position) => -26 - position * 12,
				y: (position) => position * 18,
				clipPath: 'inset(0% 22% 0% 0%)'
			},
			{
				autoAlpha: 1,
				x: 0,
				y: 0,
				clipPath: 'inset(0% 0% 0% 0%)',
				duration: 0.34,
				stagger: 0.065,
				ease: 'power2.out'
			},
			at + 0.08
		);
	}

	if (matrixChildren.length) {
		const fromRight = scene.querySelector('[data-reveal="skill-wave-right"]');
		const fromLeft = scene.querySelector('[data-reveal="skill-wave-left"]');
		timeline.fromTo(
			matrixChildren,
			{
				autoAlpha: 0,
				y: (position) => (position % 2 === 0 ? 22 : -14),
				x: (position) => {
					if (fromRight) return 24 + position * 3;
					if (fromLeft) return -24 - position * 3;
					return staggerFromSide(position);
				},
				clipPath: 'inset(0% 0% 22% 0%)'
			},
			{
				autoAlpha: 1,
				y: 0,
				x: 0,
				clipPath: 'inset(0% 0% 0% 0%)',
				duration: 0.32,
				stagger: { each: 0.04, grid: 'auto', from: fromRight ? 'end' : 'start' },
				ease: 'power2.out'
			},
			at + 0.08
		);
	}
};

const animateIconsAndChips = (timeline: gsap.core.Timeline, scene: HTMLElement, at: number) => {
	const icons = revealElements(scene, 'icon-pop');
	const iconRails = revealElements(scene, 'icon-rail');
	const iconRailChildren = iconRails.flatMap((element) =>
		Array.from(element.children).filter((child): child is HTMLElement => child instanceof HTMLElement)
	);
	const chipGroups = revealElements(scene, 'chip-cascade');
	const chipContainers = chipGroups.filter(
		(element) => !element.classList.contains('chip') && !element.classList.contains('impact-pill')
	);
	const chips = chipGroups.filter(
		(element) => element.classList.contains('chip') || element.classList.contains('impact-pill')
	);

	if (iconRails.length) {
		timeline.set(
			iconRails,
			{ autoAlpha: 1, x: 0, y: 0, rotation: 0, clipPath: 'inset(0% 0% 0% 0%)' },
			at
		);
	}

	if (chipContainers.length) {
		timeline.set(
			chipContainers,
			{ autoAlpha: 1, x: 0, y: 0, rotation: 0, clipPath: 'inset(0% 0% 0% 0%)' },
			at
		);
	}

	if (iconRailChildren.length) {
		timeline.fromTo(
			iconRailChildren,
			{ autoAlpha: 0, y: 18, rotation: -4, clipPath: 'inset(0% 45% 0% 0%)' },
			{ autoAlpha: 1, y: 0, rotation: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.22, stagger: 0.025, ease: 'power2.out' },
			at
		);
	}

	if (icons.length) {
		timeline.fromTo(
			icons,
			{ autoAlpha: 0, y: -10, rotation: (position) => (position % 2 === 0 ? -8 : 8), clipPath: 'inset(35% 35% 35% 35%)' },
			{ autoAlpha: 1, y: 0, rotation: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.2, stagger: 0.012, ease: 'back.out(1.6)' },
			at + 0.05
		);
	}

	if (chips.length) {
		timeline.fromTo(
			chips,
			{ autoAlpha: 0, x: (position) => staggerFromSide(position), y: 10, rotation: (position) => (position % 2 === 0 ? -1.2 : 1.2) },
			{ autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: 0.2, stagger: 0.012, ease: 'power2.out' },
			at + 0.1
		);
	}
};

const animatePlatesAndLines = (timeline: gsap.core.Timeline, scene: HTMLElement, at: number) => {
	const plates = revealElements(scene, 'plate-roll');
	const terminalLines = revealElements(scene, 'terminal-line');
	const buttonGroups = revealElements(scene, 'button-stagger');
	const buttons = buttonGroups.flatMap((element) =>
		Array.from(element.children).filter((child): child is HTMLElement => child instanceof HTMLElement)
	);
	const links = revealElements(scene, 'link-pulse');

	if (buttonGroups.length) {
		timeline.set(
			buttonGroups,
			{ autoAlpha: 1, x: 0, y: 0, rotation: 0, clipPath: 'inset(0% 0% 0% 0%)' },
			at
		);
	}

	if (plates.length) {
		timeline.fromTo(
			plates,
			{ autoAlpha: 0, x: -22, y: 14, rotation: -3, clipPath: 'inset(0% 22% 0% 0%)' },
			{ autoAlpha: 1, x: 0, y: 0, rotation: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.32, stagger: 0.035, ease: 'power2.out' },
			at
		);
	}

	if (terminalLines.length) {
		timeline.fromTo(
			terminalLines,
			{ autoAlpha: 0, x: -12, clipPath: 'inset(0% 100% 0% 0%)' },
			{ autoAlpha: 1, x: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.24, stagger: 0.045, ease: 'power1.out' },
			at + 0.12
		);
	}

	if (buttons.length) {
		timeline.fromTo(
			buttons,
			{ autoAlpha: 0, x: (position) => staggerFromSide(position), y: 16 },
			{ autoAlpha: 1, x: 0, y: 0, duration: 0.22, stagger: 0.035, ease: 'power2.out' },
			at + 0.14
		);
	}

	if (links.length) {
		timeline.fromTo(
			links,
			{ autoAlpha: 0, x: -12 },
			{ autoAlpha: 1, x: 0, duration: 0.2, stagger: 0.045, ease: 'power2.out' },
			at + 0.18
		);
		timeline.to(
			links.flatMap((link) => Array.from(link.querySelectorAll<SVGElement>('svg'))),
			{ x: 5, duration: 0.08, repeat: 1, yoyo: true, ease: 'power1.inOut' },
			at + 0.38
		);
	}
};

const animateCounters = (timeline: gsap.core.Timeline, scene: HTMLElement, at: number) => {
	const counters = revealElements(scene, 'counter-sweep');
	if (!counters.length) return;

	timeline.fromTo(
		counters,
		{ autoAlpha: 0, y: 12, clipPath: 'inset(0% 0% 42% 0%)' },
		{
			autoAlpha: 1,
			y: 0,
			clipPath: 'inset(0% 0% 0% 0%)',
			duration: 0.24,
			stagger: 0.04,
			ease: 'power2.out'
		},
		at
	);
};

const animateSceneComponents = (timeline: gsap.core.Timeline, scene: HTMLElement, at: number) => {
	animateCards(timeline, scene, at);
	animatePlatesAndLines(timeline, scene, at + 0.04);
	animateLineMasks(timeline, scene, at + 0.08);
	animateWordRise(timeline, scene, at + 0.14);
	animateCopyFade(timeline, scene, at + 0.13);
	animateCharScan(timeline, scene, at + 0.1);
	animateCounters(timeline, scene, at + 0.12);
	animateIconsAndChips(timeline, scene, at + 0.16);
};

const fadeSceneComponents = (timeline: gsap.core.Timeline, scene: HTMLElement, at: number) => {
	const primary = Array.from(
		scene.querySelectorAll<HTMLElement>(
			'[data-reveal="card-lift"], [data-reveal="border-trace"], [data-reveal="plate-roll"], [data-reveal="line-mask"], [data-reveal="word-rise"], [data-reveal="copy-fade"], [data-reveal="metric-sweep"], [data-reveal="skill-wave-left"], [data-reveal="skill-wave-right"], [data-reveal="contact-rise"], [data-reveal="project-terminal"], [data-reveal="logo-flow"], [data-reveal="terminal-line"], [data-reveal="link-pulse"]'
		)
	);

	if (!primary.length) return;

	timeline.to(
		primary,
		{ autoAlpha: 0, y: -12, duration: 0.18, stagger: { each: 0.008, from: 'end' }, ease: 'power1.in' },
		at
	);
};

const animateMetricCounters = () => {
	document.querySelectorAll<HTMLElement>('[data-count]').forEach((element) => {
		const target = Number(element.dataset.count ?? '0');
		const suffix = element.dataset.suffix ?? '';
		const decimals = target % 1 === 0 ? 0 : 1;
		element.textContent = `${target.toFixed(decimals)}${suffix}`;
	});
};

const buildMasterTimeline = () => {
	if (!storyPin || !storyStage || !scenes.length) return;

	gsap.registerPlugin(ScrollTrigger);
	prepareTextReveals();
	gsap.set(storyStage, { clearProps: 'transform' });
	gsap.set(scenes, {
		autoAlpha: 0,
		x: 0,
		y: 0,
		rotation: 0,
		transformOrigin: 'center center'
	});
	gsap.set(scenes[0], { autoAlpha: 1 });

	scenes.forEach((scene, index) => setRevealState(scene, index === 0));

	const timeline = gsap.timeline({
		defaults: { ease: 'power2.inOut' },
		scrollTrigger: {
			id: 'master-story',
			trigger: storyPin,
			start: 'top top',
			end: () => `+=${Math.max(10, scenes.length) * window.innerHeight}`,
			pin: true,
			pinSpacing: true,
			scrub: 1,
			anticipatePin: 1,
			invalidateOnRefresh: true,
			onUpdate: () => {
				if (!masterTimeline) return;
				const activeIndex = sceneIndexFromTimeline(masterTimeline);
				if (scenes[activeIndex]) setActiveScene(scenes[activeIndex]);
				setTimelineFill(masterTimeline.progress());
			}
		}
	});
	masterTimeline = timeline;

	scenes.forEach((scene, index) => {
		const cue = index;
		timeline.addLabel(sceneStartLabel(index), cue);

		if (index === 0) {
			timeline.addLabel(sceneReadyLabel(index), cue);
			return;
		}

		const previous = scenes[index - 1];
		fadeSceneComponents(timeline, previous, cue - 0.28);
		timeline.to(previous, { autoAlpha: 0, duration: 0.16, ease: 'none' }, cue - 0.08);
		timeline.set(scene, { autoAlpha: 1 }, cue - 0.12);
		animateSceneComponents(timeline, scene, cue - 0.08);
		timeline.addLabel(sceneReadyLabel(index), cue + sceneReadyOffset);
	});

	animateMetricCounters();

	const refreshAndHonorHash = () => {
		const hash = currentSceneHash();
		if (hash !== '#intro') window.scrollTo({ top: 0, behavior: 'auto' });
		ScrollTrigger.refresh();
		if (hash) {
			[80, 320, 760].forEach((delay) => {
				window.setTimeout(() => {
					ScrollTrigger.refresh();
					scrollToScene(hash, false);
				}, delay);
			});
		}
	};

	if (document.readyState === 'complete') {
		refreshAndHonorHash();
	} else {
		window.addEventListener('load', refreshAndHonorHash);
	}
};

const startMotion = () => {
	if (reducedMotion) {
		setupStaticReducedMotion();
		window.requestAnimationFrame(() => scrollToScene(currentSceneHash(), false));
		return;
	}

	if ('fonts' in document) {
		document.fonts.ready.then(buildMasterTimeline).catch(buildMasterTimeline);
		return;
	}

	buildMasterTimeline();
};

window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
window.addEventListener('popstate', () => scrollToScene(currentSceneHash(), false));
updateProgress();
setupTiltCards();
setupRouteJumps();
setupAnchorJumps();
setupShareButton();

if (scenes[0]) setActiveScene(scenes[0]);
startMotion();
