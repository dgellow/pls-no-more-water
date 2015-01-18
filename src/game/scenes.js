var Game = require('./game');
var _ = require('lodash');

// Game scene
function enterGame() {
    var p = Crafty.e('Player').attr({x: 0, y: 10});
    Crafty.viewport.follow(p);

    Crafty.e('Solid').attr({x: 0, y: 0, w: 200});
    Crafty.e('Solid').attr({x: 300, y: 0, w: 250});

    _.range(-2, -1000, -1.1).forEach(function(n) {
        Crafty.e('Solid').attr({x: (300 * Math.random()),
                                y: (n * 100) + (100 * Math.random()),
                                w:  20 + (100 * Math.random())});
    });
}

Crafty.scene('Game', enterGame);

// Loading scene
var objAssets = {
    sprites: {
        'assets/space-suit.png': {
            tile: 30,
            tileh: 36,
            map: {
                sprite_player: [0, 0]
            }
        },
        'assets/asteroid-platform.png': {
            tile: 155,
            tileh: 21,
            map: {
                sprite_platform: [0, 0]
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
