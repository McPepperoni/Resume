export type TERRAIN_PROPERTY = {
    name: string;
    color: string;
};

export const TERRAIN: Record<string, TERRAIN_PROPERTY> = {
    DIRT: {
        name: 'ground',
        color: 'brown',
    },
    SAND: {
        name: 'sand',
        color: 'yellow',
    },
} as const;


export const MAP_ARRAY = [
    [TERRAIN.DIRT, TERRAIN.SAND],
    [TERRAIN.DIRT, TERRAIN.SAND],
    [TERRAIN.DIRT, TERRAIN.SAND],
] as const;

export const MAP_SIZE = {
    WIDTH: MAP_ARRAY.at(0)?.length ?? 0,
    HEIGHT: MAP_ARRAY.length,
} as const;

export function getTerrainMap(): Record<number, Record<number, (typeof TERRAIN)[keyof typeof TERRAIN]>> {
    const map: Record<number, Record<number, (typeof TERRAIN)[keyof typeof TERRAIN]>> = {};
    for (let i = 0; i < MAP_ARRAY.length; i++) {
        map[i] = {};
        for (let j = 0; j < MAP_ARRAY[i].length; j++) {
            map[i][j] = MAP_ARRAY[i][j];
        }
    }
    return map;
}