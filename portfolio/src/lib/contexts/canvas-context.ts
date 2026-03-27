import { createContext } from "svelte";

type CanvasContext = {
    getCanvas: () => HTMLCanvasElement | null;
    setCanvas: (canvas: HTMLCanvasElement) => void;
}

export const [getCanvasContext, setCanvasContext] = createContext<CanvasContext>();
