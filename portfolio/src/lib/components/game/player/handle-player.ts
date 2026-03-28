import { type KEY_MAP } from "$lib/contexts/control-context";
import { type PLAYER } from "$lib/contexts/player-context";
import { FPS, PLAYER_SPEED } from "$lib/settings";

export const handlePlayer = (keyMap: KEY_MAP, player: PLAYER, setPlayer: (player: PLAYER) => void) => {

    const speed = PLAYER_SPEED / FPS;

    let x = player.x;
    let y = player.y;
    if (keyMap.left) x -= speed;
    if (keyMap.right) x += speed;
    if (keyMap.space) y += speed;
    if (x !== player.x || y !== player.y) {
        setPlayer({ ...player, x, y });
    }
}