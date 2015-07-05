/* jshint esnext: true */
import tilemap from '../assets/map.json';
import _ from 'lodash';

let audio = {
    'you_are_dead': 'assets/you_are_dead.ogg',
    'resurection': 'assets/resurection.ogg'
};

let sprites = {
    'assets/hero-good.png': {
        tile: 25,
        tileh: 36,
        map: {
            sprite_player_good: [0, 0]
        }
    },
    'assets/hero-evil.png': {
        tile: 35,
        tileh: 36,
        map: {
            sprite_player_evil: [0, 0]
        }
    },

    'assets/wave-good.png': {
        tile: 1617,
        tileh: 661,
        map: {
            sprite_wave_good: [0, 0]
        }
    },
    'assets/wave-evil.png': {
        tile: 1617,
        tileh: 661,
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
            sprite_platform_1_good: [3, 1],
            sprite_platform_2_good: [1, 2],
            sprite_platform_3_good: [2, 2],
            sprite_platform_4_good: [0, 3],
            sprite_platform_5_good: [1, 3],
            sprite_lava_1_good: [3, 2],
            sprite_lava_2_good: [2, 3],
            sprite_lava_3_good: [3, 3],
            sprite_item_good: [2, 1],
            sprite_blue_good: [0, 2],
            sprite_wall_good: [2, 0],
            sprite_wall_dark_good: [3, 0]
        }
    },

    'assets/tiles-evil.png': {
        tile: 32,
        tileh: 32,
        map: {
            sprite_ground_1_evil: [0, 0],
            sprite_ground_2_evil: [1, 0],
            sprite_ground_3_evil: [0, 1],
            sprite_ground_4_evil: [1, 1],
            sprite_platform_1_evil: [3, 1],
            sprite_platform_2_evil: [1, 2],
            sprite_platform_3_evil: [2, 2],
            sprite_platform_4_evil: [0, 3],
            sprite_platform_5_evil: [1, 3],
            sprite_lava_1_evil: [3, 2],
            sprite_lava_2_evil: [2, 3],
            sprite_lava_3_evil: [3, 3],
            sprite_item_evil: [2, 1],
            sprite_blue_evil: [0, 2],
            sprite_wall_evil: [2, 0],
            sprite_wall_dark_evil: [3, 0]
        }
    },

    'assets/light.png': {
        tile: 64,
        tileh: 64,
        map: {
            sprite_light: [0, 0],
            sprite_key: [1, 3]
        }
    }
};

let objAssets = {sprites, audio};
export {objAssets};

export function generateMap() {
    let sprites = [
        null,
        'sprite_ground_1',
        'sprite_ground_2',
        'sprite_wall',
        'sprite_wall_dark',
        'sprite_ground_3',
        'sprite_ground_4',
        'sprite_item',
        'sprite_platform_1',
        'sprite_blue',
        'sprite_platform_2',
        'sprite_platform_3',
        'sprite_lava_1',
        'sprite_platform_4',
        'sprite_platform_5',
        'sprite_lava_2',
        'sprite_lava_3'
    ];

    let {
        height,
        width,
        layers,
        tileheight,
        tilewidth
    } = tilemap;

    [
        generateWalls,
        generateBackground,
        generateItems,
        generateCollisions,
        generateGoalLevel
    ].forEach((f) => {
         f.apply(this, [
             width,
             height,
             tileheight,
             tilewidth,
             layers,
             sprites
         ]);
     });
}

function generateWalls(levelWidth, levelHeight, tileheight, tilewidth, layers, sprites) {
    _.filter(layers, (l) => {
        return l.name === 'walls';
    }).forEach((layer) => {
        for (var x = 0; x < levelWidth; x++) {
            for (var y = 0; y < levelHeight; y++) {
                let sprite = sprites[layer.data[(levelWidth * y) + x]];
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

function generateBackground(levelWidth, levelHeight, tileheight, tilewidth, layers, sprites) {
    _.filter(layers, (l) => {
        return l.name === 'background';
    }).forEach((layer) => {
        for (var x = 0; x < levelWidth; x++) {
            for (var y = 0; y < levelHeight; y++) {
                let sprite = sprites[layer.data[(levelWidth * y) + x]];
                if (sprite) {
                    Crafty.e('2D, Canvas, Phase')
                        .attr({
                            x: x * tilewidth,
                            y: y * tileheight,
                            w: tilewidth,
                            h: tileheight,
                            z: -1
                        })
                        .setGoodSprite(`${sprite}_good`)
                        .setEvilSprite(`${sprite}_evil`);
                }
            }
        }
    });
}

function generateItems(levelWidth, levelHeight, tileheight, tilewidth, layers, sprites) {
    _.filter(layers, (l) => {
        return l.name === 'items';
    }).forEach((layer) => {
        for (var x = 0; x < levelWidth; x++) {
            for (var y = 0; y < levelHeight; y++) {
                if (layer.data[(levelWidth * y) + x]) {
                    Crafty.e('2D, Canvas, sprite_key')
                        .attr({
                            x: x * tilewidth,
                            y: y * tileheight
                        });
                }
            }
        }
    });
}

function generateCollisions(__, ______, ___, ____, layers, _____) {
    _.filter(layers, (l) => {
        return l.type === 'objectgroup';
    }).forEach((layer) => {
        layer.objects.forEach((obj) => {
            Crafty.e('Solid')
                .setMetrics({
                    x: obj.x,
                    y: obj.y,
                    h: obj.height,
                    w: obj.width
                });
        });
    });
}

function generateGoalLevel(__, ______, ___, ____, layers, _____) {
    _.filter(layers, (l) => {
        return l.type === 'objectgroup';
    }).forEach((layer) => {
        _.filter(layer.objects, (obj) => {
            return obj.type === 'goalLevel';
        }).forEach((obj) => {
            Crafty.e('LevelGoal')
                .setMetrics({
                    x: obj.x,
                    y: obj.y,
                    h: obj.height,
                    w: obj.width
                });
        });
    });
}
