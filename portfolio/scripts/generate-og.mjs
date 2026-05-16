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

const wrapText = (text, maxChars) => {
	const words = text.split(/\s+/);
	const lines = [];
	let line = '';
	for (const word of words) {
		const next = line ? `${line} ${word}` : word;
		if (next.length > maxChars && line) {
			lines.push(line);
			line = word;
		} else {
			line = next;
		}
	}
	if (line) lines.push(line);
	return lines.slice(0, 4);
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
	fillRect(image, 0, 0, WIDTH, HEIGHT, palette.void);
	for (let x = 0; x < WIDTH; x += 64) fillRect(image, x, 0, 2, HEIGHT, palette.gunmetal);
	for (let y = 0; y < HEIGHT; y += 64) fillRect(image, 0, y, WIDTH, 2, palette.gunmetal);
	strokeRect(image, 44, 44, WIDTH - 88, HEIGHT - 88, palette.mint, 4);
	fillRect(image, 72, 72, 190, 8, palette.mint);
	fillRect(image, 88, 108, 22, 22, palette.mint);
	drawText(image, `${String(index + 1).padStart(2, '0')} ${scene.label}`, 124, 104, 4, palette.mint);
	drawText(image, profile.name, 88, 170, 8, palette.white);
	const titleLines = wrapText(scene.title.replace(` | ${profile.name}`, ''), 28);
	titleLines.forEach((line, lineIndex) => {
		drawText(image, line, 88, 270 + lineIndex * 56, 7, palette.white);
	});
	const detailLines = wrapText(scene.description, 68);
	detailLines.slice(0, 2).forEach((line, lineIndex) => {
		drawText(image, line, 92, 500 + lineIndex * 30, 3, palette.muted);
	});
	fillRect(image, WIDTH - 310, 118, 220, 220, palette.carbon);
	strokeRect(image, WIDTH - 310, 118, 220, 220, palette.blue, 4);
	drawText(image, scene.chapter.replace('-', ' '), WIDTH - 282, 210, 5, palette.blue);
	return encodePng(image);
};

mkdirSync(OUT_DIR, { recursive: true });
sceneSeoItems.forEach((scene, index) => {
	const png = renderScene(scene, index);
	writeFileSync(join(ROOT, 'public', scene.ogImage), png);
});

console.log(`Generated ${sceneSeoItems.length} PNG Open Graph images.`);
