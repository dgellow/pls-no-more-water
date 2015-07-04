/* jshint esnext: true */
import tilemap from '../assets/map.json';

let sprites = {
    'assets/space-suit-good.png': {
        tile: 30,
        tileh: 36,
        map: {
            sprite_player_good: [0, 0]
        }
    },
    'assets/space-suit-evil.png': {
        tile: 30,
        tileh: 36,
        map: {
            sprite_player_evil: [0, 0]
        }
    },

    'assets/asteroid-platform.png': {
        tile: 155,
        tileh: 21,
        map: {
            sprite_platform_good: [0, 0],
            sprite_platform_evil: [0, 1]
        }
    },

    'assets/wave-good.png': {
        tile: 61,
        tileh: 70,
        map: {
            sprite_wave_good: [0, 0]
        }
    },
    'assets/wave-evil.png': {
        tile: 61,
        tileh: 70,
        map: {
            sprite_wave_evil: [0, 0]
        }
    },

    'assets/tiles-good.png': {
        tile: 32,
        tileh: 32,
        map: {
            sprite_platform_good: [0, 0],
            sprite_item_good: [0, 1],
            sprite_wall_good: [1, 0],
            sprite_ground_good: [1, 1]
        }
    },
    'assets/tiles-evil.png': {
        tile: 32,
        tileh: 32,
        map: {
            sprite_platform_evil: [0, 0],
            sprite_item_evil: [0, 1],
            sprite_wall_evil: [1, 0],
            sprite_ground_evil: [1, 1]
        }
    }
};

let objAssets = {sprites};
export {objAssets};

export function generateMap() {
    let sprites = [
        null,
        'sprite_platform',
        'sprite_item',
        'sprite_wall',
        'sprite_ground'
    ];

    let {
        height,
        width,
        layers,
        tileheight,
        tilewidth
    } = tilemap;

    layers.forEach((layer) => {
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                let sprite = sprites[layer.data[(width * y) + x]];
                if (sprite) {
                    Crafty.e('Platform')
                        .setMetrics({
                            x: x * tilewidth,
                            y: y * tileheight,
                            w: tilewidth,
                            h: tileheight
                        })
                        .setGoodSprite(`${sprite}_good`)
                        .setEvilSprite(`${sprite}_evil`);
                }
            }
        }
    });
}
