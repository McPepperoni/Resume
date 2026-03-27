export const getCircleRadius = (x: number, y: number, h: number, k: number) => {
    return Math.sqrt((x - h) ** 2 + (y - k) ** 2);
}