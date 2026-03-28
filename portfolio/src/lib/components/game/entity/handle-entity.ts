import type { ENTITY } from "$lib/contexts/entity-context";
import { FPS, GRAVITY } from "$lib/settings";

export const handleEntity = (entities: Record<string, ENTITY>, setEntity: (id: string, entity: ENTITY) => void) => {
    Object.entries(entities).forEach(([id, entity]) => {
        if (entity.gravityAffected) {
            entity.y -= GRAVITY / FPS;
            setEntity(id, entity);
        }
    });
}