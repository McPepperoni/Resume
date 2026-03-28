import { createContext } from "svelte";

export type ENTITY = {
    x: number;
    y: number;
    boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    gravityAffected: boolean;
    facing: 'left' | 'right';
}

export type EntityContext = {
    getEntities: () => Record<string, ENTITY>;
    setEntities: (id: string, entity: ENTITY) => void;
}

export const [getEntityContext, setEntityContext] = createContext<EntityContext>();