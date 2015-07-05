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
            sprite_ground_1_good: [0, 0],
            sprite_ground_2_good: [1, 0],
            sprite_ground_3_good: [0, 1],
            sprite_ground_4_good: [1, 1],
            sprite_platform_good: [0, 2],
            sprite_item_good: [2, 1],
            sprite_wall_good: [2, 0]
        }
    },

    'assets/tiles-evil.png': {
        tile: 32,
        tileh: 32,
        map: {
            sprite_ground_1_evil: [0, 0],
            sprite_ground_2_evil: [0, 1],
            sprite_ground_3_evil: [1, 0],
            sprite_ground_4_evil: [1, 1],
            sprite_platform_evil: [2, 0],
            sprite_item_evil: [1, 2],
            sprite_wall_evil: [0, 2]
        }
    }
};

let objAssets = {sprites};
export {objAssets};

export function generateMap() {
    let sprites = [
        null,
        'sprite_ground_1',
        'sprite_ground_2',
        'sprite_wall',
        'sprite_ground_3',
        'sprite_ground_4',
        'sprite_item',
        'sprite_platform'
    ];

    let {
        height,
        width,
        layers,
        tileheight,
        tilewidth
    } = tilemap;

    layers.forEach((layer) => {
        var firstCoord ;
        var lastCoord;
        var begunHitbox = false
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                let layerValue = layer.data[(width * y) + x],
                    sprite = sprites[layerValue];
                if (sprite) {
                    Crafty.e('Platform')
                        .attr({
                            x: x * tilewidth,
                            y: y * tileheight,
                            w: tilewidth,
                            h: tileheight
                        })
                        .setGoodSprite(`${sprite}_good`)
                        .setEvilSprite(`${sprite}_evil`);
                }
                if (layerValue == 4 && !begunHitbox) {
                    begunHitbox = true;
                    firstCoord = {x: x * tilewidth, y: y * tileheight};
                }
                if (begunHitbox && layerValue != 4) {
                    begunHitbox = false;
                    lastCoord = {x: x * tilewidth, y: y * tileheight};
                    Crafty.e('2D, Canvas, Box2D')
                        .attr({x: firstCoord.x,
                            y: firstCoord.y,
                            w: lastCoord.x - firstCoord.x,
                            h: lastCoord.y - firstCoord.y })
                        .box2d({
                            bodyType: 'static',
                            density: 1.0,
                            friction: 0,
                            restitution: 0
                        });
                }
            }
        }
    });
}
