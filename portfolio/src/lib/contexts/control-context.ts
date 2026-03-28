import { createContext } from "svelte";

export type KEY = "up" | "down" | "left" | "right" | "space" | "escape"

export type KEY_MAP = Record<KEY, boolean>;

type ControlContext = {
    getKeyMap: () => KEY_MAP;
    keysPressed: (keys: KEY[]) => void;
    keysReleased: (keys: KEY[]) => void;
}

export const [getControlContext, setControlContext] = createContext<ControlContext>();