import { createContext } from "svelte";

type CanvasContext = {
    getCanvas: () => HTMLCanvasElement | null;
    setCanvas: (canvas: HTMLCanvasElement) => void;
    resolution: number;
}

export const [getCanvasContext, setCanvasContext] = createContext<CanvasContext>();
