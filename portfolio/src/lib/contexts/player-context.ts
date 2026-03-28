import { createContext } from "svelte";
import type { ENTITY } from "./entity-context";

export type PLAYER = ENTITY

export type PlayerContext = {
    getPlayer: () => PLAYER;
    setPlayer: (player: PLAYER) => void;
}

export const [getPlayerContext, setPlayerContext] = createContext<PlayerContext>();