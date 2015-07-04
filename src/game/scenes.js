/* jshint esnext: true */
let Game = require('./game');
let _ = require('lodash');

// Game scene
function enterGame() {
    // Player
    var p = Crafty.e('Player')
            .controls(30)
            .setMetrics({x: 100, y: -200}, {
                bodyType: 'dynamic',
                density : 10,
                friction : 30,
                restitution : 0.1
            });
    Crafty.viewport.follow(p);

    // Platforms
    Crafty.e('Platform').setMetrics({x: 0, y: 0, w: 50000});

    // Tools
    Crafty.e('Hook');
    Crafty.e('Dash');

    // Wave
    Crafty.e('Wave')
        .setMetrics({x: 0, y: -200, h: 200}, {
            bodyType: 'kinematic',
            density : 10,
            friction : 30,
            restitution : 0
        })
        .setSpeed(10);

    // Global events
    Crafty.e('Keyboard').bind('KeyDown', (e) => {
        switch (e.key) {
        case Crafty.keys.SHIFT:
            Crafty.trigger('changePhase', Game.shiftPhase());
            break;
        }
    });

    Crafty.e('Mouse').bind('Click', (MouseEvent) => {
        console.log('clicked', MouseEvent);
    });
}

Crafty.scene('Game', enterGame);

// Loading scene
let objAssets = {
    sprites: {
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
        }
    }
};

function assetsLoaded() {
    Crafty.scene('Game');
}

function enterLoading() {
    Crafty.e('2D, DOM, Text')
        .attr({x: 0, y: 0})
        .text('Loading ...')
        .css(Game.textStyle);

    Crafty.load(objAssets, assetsLoaded);
}

Crafty.scene('Loading', enterLoading);
