/* jshint esnext: true */
let Game = require('./game');
let _ = require('lodash');

// Game scene
function enterGame() {
    var p = Crafty.e('Player').attr({x: 0, y: 5});
    Crafty.viewport.follow(p);

    Crafty.e('Platform').attr({x: 0, y: 0, w: 5000});

    Crafty.e('Keyboard').bind('KeyDown', (e) => {
        switch (e.key) {
        case Crafty.keys.SHIFT:
            Crafty.trigger('changePhase', Game.shiftPhase());
            break;
        }
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
