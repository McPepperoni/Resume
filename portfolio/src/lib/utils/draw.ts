import type { TERRAIN } from "$lib/constants/map/terrain";
import { getCanvasContext } from "$lib/contexts/canvas-context";

export const draw = (fnc: (ctx: CanvasRenderingContext2D, _x: number, _y: number) => void, x: number, y: number) => {
    const canvas = getCanvasContext().getCanvas();

    if (!canvas) {
        throw new Error('Canvas not found');
    }

    const ctx = canvas.getContext('2d');
    const { height } = canvas;

    if (!ctx) {
        throw new Error('Canvas context not found');
    }

    fnc(ctx, x, height - y);
}

export const drawBlock = (type: (typeof TERRAIN)[keyof typeof TERRAIN], x: number, y: number) => {
    const { resolution } = getCanvasContext();
    draw((ctx, x, y) => {
        ctx.fillStyle = type.color;
        ctx.fillRect(x * resolution, y * resolution, resolution, -resolution);
    }, x, y);
}