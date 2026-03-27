import type { TIME } from "$lib/constants/time";
import { createContext } from "svelte";

type TimeContext = {
    getTime: () => (typeof TIME)[keyof typeof TIME];
    setTime: (time: (typeof TIME)[keyof typeof TIME]) => void;
}

const [getTimeContext, setTimeContext] = createContext<TimeContext>();

export { getTimeContext, setTimeContext };

