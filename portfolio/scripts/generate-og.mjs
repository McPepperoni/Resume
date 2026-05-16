import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

import { profile } from '../src/data/resume.ts';
import { sceneSeoItems } from '../src/data/seo.ts';

const WIDTH = 1200;
const HEIGHT = 630;
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = join(ROOT, 'public', 'og');

const palette = {
	void: [5, 6, 8, 255],
	carbon: [17, 19, 24, 255],
	gunmetal: [27, 31, 39, 255],
	white: [244, 247, 251, 255],
	muted: [154, 164, 178, 255],
	mint: [0, 229, 176, 255],
	blue: [77, 124, 255, 255],
	red: [255, 53, 94, 255],
	amber: [245, 197, 66, 255]
};

const font = {
	A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
	B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
	C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
	D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
	E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
	F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
	G: ['01111', '10000', '10000', '10011', '10001', '10001', '01111'],
	H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
	I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
	J: ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
	K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
	L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
	M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
	N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
	O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
	P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
	Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
	R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
	S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
	T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
	U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
	V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
	W: ['10001', '10001', '10001', '10101', '10101', '10101', '01010'],
	X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
	Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
	Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
	0: ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
	1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
	2: ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
	3: ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
	4: ['10010', '10010', '10010', '11111', '00010', '00010', '00010'],
	5: ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
	6: ['01111', '10000', '10000', '11110', '10001', '10001', '01110'],
	7: ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
	8: ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
	9: ['01110', '10001', '10001', '01111', '00001', '00001', '11110'],
	' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
	'-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
	'/': ['00001', '00001', '00010', '00100', '01000', '10000', '10000'],
	'&': ['01100', '10010', '10100', '01000', '10101', '10010', '01101'],
	'.': ['00000', '00000', '00000', '00000', '00000', '01100', '01100'],
	':': ['00000', '01100', '01100', '00000', '01100', '01100', '00000'],
	'+': ['00000', '00100', '00100', '11111', '00100', '00100', '00000'],
	'%': ['11001', '11010', '00100', '01000', '10110', '00110', '00000'],
	'|': ['00100', '00100', '00100', '00100', '00100', '00100', '00100']
};

const createImage = () => new Uint8ClampedArray(WIDTH * HEIGHT * 4);

const setPixel = (image, x, y, color) => {
	if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return;
	const offset = (y * WIDTH + x) * 4;
	image[offset] = color[0];
	image[offset + 1] = color[1];
	image[offset + 2] = color[2];
	image[offset + 3] = color[3];
};

const fillRect = (image, x, y, width, height, color) => {
	for (let yy = Math.max(0, y); yy < Math.min(HEIGHT, y + height); yy += 1) {
		for (let xx = Math.max(0, x); xx < Math.min(WIDTH, x + width); xx += 1) {
			setPixel(image, xx, yy, color);
		}
	}
};

const strokeRect = (image, x, y, width, height, color, thickness = 3) => {
	fillRect(image, x, y, width, thickness, color);
	fillRect(image, x, y + height - thickness, width, thickness, color);
	fillRect(image, x, y, thickness, height, color);
	fillRect(image, x + width - thickness, y, thickness, height, color);
};

const drawText = (image, text, x, y, scale, color) => {
	let cursor = x;
	for (const rawChar of text.toUpperCase()) {
		const glyph = font[rawChar] ?? font[' '];
		for (let row = 0; row < glyph.length; row += 1) {
			for (let col = 0; col < glyph[row].length; col += 1) {
				if (glyph[row][col] !== '1') continue;
				fillRect(image, cursor + col * scale, y + row * scale, scale, scale, color);
			}
		}
		cursor += 6 * scale;
	}
};

const measureText = (text, scale) => text.toUpperCase().length * 6 * scale;

const splitLongWord = (word, maxWidth, scale) => {
	const chunks = [];
	let chunkText = '';
	for (const char of word) {
		const next = `${chunkText}${char}`;
		if (chunkText && measureText(next, scale) > maxWidth) {
			chunks.push(chunkText);
			chunkText = char;
		} else {
			chunkText = next;
		}
	}
	if (chunkText) chunks.push(chunkText);
	return chunks;
};

const fitWithEllipsis = (line, maxWidth, scale) => {
	let result = line.trimEnd();
	while (result && measureText(`${result}...`, scale) > maxWidth) {
		result = result.slice(0, -1).trimEnd();
	}
	return result ? `${result}...` : '...';
};

const wrapText = (text, maxWidth, scale, maxLines = Number.POSITIVE_INFINITY) => {
	const words = text.trim().replace(/\s+/g, ' ').split(' ').flatMap((word) => {
		return measureText(word, scale) <= maxWidth ? [word] : splitLongWord(word, maxWidth, scale);
	});
	const lines = [];
	let line = '';
	let truncated = false;

	for (let index = 0; index < words.length; index += 1) {
		const word = words[index];
		const next = line ? `${line} ${word}` : word;
		if (measureText(next, scale) <= maxWidth) {
			line = next;
			continue;
		}

		if (line) {
			if (lines.length === maxLines - 1) {
				lines.push(fitWithEllipsis(line, maxWidth, scale));
				truncated = true;
				return { lines, truncated };
			}
			lines.push(line);
			line = word;
		} else {
			if (lines.length === maxLines - 1 && index < words.length - 1) {
				lines.push(fitWithEllipsis(word, maxWidth, scale));
				truncated = true;
				return { lines, truncated };
			}
			lines.push(word);
			line = '';
		}
	}

	if (line) {
		if (lines.length < maxLines) {
			lines.push(line);
		} else {
			lines[lines.length - 1] = fitWithEllipsis(lines[lines.length - 1], maxWidth, scale);
			truncated = true;
		}
	}

	return { lines, truncated };
};

const fitTextBlock = (text, maxWidth, scaleOptions, maxLines) => {
	for (const scale of scaleOptions) {
		const wrapped = wrapText(text, maxWidth, scale, maxLines);
		if (!wrapped.truncated) return { ...wrapped, scale };
	}
	const scale = scaleOptions[scaleOptions.length - 1];
	return { ...wrapText(text, maxWidth, scale, maxLines), scale };
};

const normalizeTitle = (title) => {
	const escapedName = profile.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return title
		.replace(new RegExp(escapedName, 'gi'), '')
		.replace(/\s*\|\s*/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
};

const crcTable = new Uint32Array(256).map((_, index) => {
	let c = index;
	for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
	return c >>> 0;
});

const crc32 = (buffer) => {
	let crc = 0xffffffff;
	for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
	return (crc ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
	const typeBuffer = Buffer.from(type);
	const length = Buffer.alloc(4);
	const crc = Buffer.alloc(4);
	length.writeUInt32BE(data.length);
	crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
	return Buffer.concat([length, typeBuffer, data, crc]);
};

const encodePng = (pixels) => {
	const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(WIDTH, 0);
	ihdr.writeUInt32BE(HEIGHT, 4);
	ihdr[8] = 8;
	ihdr[9] = 6;
	const raw = Buffer.alloc((WIDTH * 4 + 1) * HEIGHT);
	for (let y = 0; y < HEIGHT; y += 1) {
		raw[y * (WIDTH * 4 + 1)] = 0;
		const start = y * WIDTH * 4;
		Buffer.from(pixels.buffer, start, WIDTH * 4).copy(raw, y * (WIDTH * 4 + 1) + 1);
	}
	return Buffer.concat([
		signature,
		chunk('IHDR', ihdr),
		chunk('IDAT', deflateSync(raw, { level: 9 })),
		chunk('IEND', Buffer.alloc(0))
	]);
};

const renderScene = (scene, index) => {
	const image = createImage();
	const frame = { x: 44, y: 44, width: WIDTH - 88, height: HEIGHT - 88 };
	const contentX = 88;
	const contentRight = WIDTH - 88;
	const contentWidth = contentRight - contentX;
	const metaPlate = { x: WIDTH - 334, y: 104, width: 244, height: 150 };
	fillRect(image, 0, 0, WIDTH, HEIGHT, palette.void);
	for (let x = 0; x < WIDTH; x += 64) fillRect(image, x, 0, 2, HEIGHT, palette.gunmetal);
	for (let y = 0; y < HEIGHT; y += 64) fillRect(image, 0, y, WIDTH, 2, palette.gunmetal);
	strokeRect(image, frame.x, frame.y, frame.width, frame.height, palette.mint, 4);
	fillRect(image, 72, 72, 190, 8, palette.mint);
	fillRect(image, 88, 108, 22, 22, palette.mint);
	drawText(image, `${String(index + 1).padStart(2, '0')} ${scene.label}`, 124, 104, 4, palette.mint);

	fillRect(image, metaPlate.x, metaPlate.y, metaPlate.width, metaPlate.height, palette.carbon);
	strokeRect(image, metaPlate.x, metaPlate.y, metaPlate.width, metaPlate.height, palette.blue, 4);
	fillRect(image, metaPlate.x + 24, metaPlate.y + 26, 46, 8, palette.blue);
	drawText(image, 'ROUTE', metaPlate.x + 24, metaPlate.y + 48, 2, palette.muted);
	const metaLabel = fitTextBlock(scene.label, metaPlate.width - 48, [4, 3, 2], 1);
	metaLabel.lines.forEach((line, lineIndex) => {
		drawText(image, line, metaPlate.x + 24, metaPlate.y + 76 + lineIndex * 28, metaLabel.scale, palette.blue);
	});
	const detailBlock = fitTextBlock(scene.detail, metaPlate.width - 48, [2], 2);
	detailBlock.lines.forEach((line, lineIndex) => {
		drawText(image, line, metaPlate.x + 24, metaPlate.y + 116 + lineIndex * 22, detailBlock.scale, palette.muted);
	});

	drawText(image, profile.name, contentX, 160, 6, palette.white);
	const titleText = normalizeTitle(scene.title) || scene.label;
	const titleBlock = fitTextBlock(titleText, contentWidth, [7, 6, 5], 3);
	titleBlock.lines.forEach((line, lineIndex) => {
		drawText(image, line, contentX, 270 + lineIndex * titleBlock.scale * 8, titleBlock.scale, palette.white);
	});

	const descriptionBlock = fitTextBlock(scene.description, contentWidth, [3, 2], 3);
	descriptionBlock.lines.forEach((line, lineIndex) => {
		drawText(image, line, contentX + 4, 484 + lineIndex * descriptionBlock.scale * 10, descriptionBlock.scale, palette.muted);
	});

	return encodePng(image);
};

mkdirSync(OUT_DIR, { recursive: true });
sceneSeoItems.forEach((scene, index) => {
	const png = renderScene(scene, index);
	writeFileSync(join(ROOT, 'public', scene.ogImage), png);
});

console.log(`Generated ${sceneSeoItems.length} PNG Open Graph images.`);
