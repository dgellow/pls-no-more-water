/* jshint esnext: true */
let Game = require('./game');
import _ from 'lodash';
import {objAssets, generateMap} from './assets';
import {bindEvents, unbindEvents} from './events';
import {getEntitiesAt} from './helpers';

// Game scene
function enterGame() {
    // Background
    Crafty.background('#87b7e3 url(assets/background_good.png) repeat-x');

    // Player
    var p = Crafty.e('Player')
            .controls(1500)
            .setMetrics({
                x: 300,
                y: 320
            }, {
                bodyType: 'dynamic',
                density : 10,
                friction : 0.9,
                restitution : 0.1
            });
    Crafty.viewport.follow(p);

    // Tools
    Crafty.e('Jump').attr({_intensity: 60});
    Crafty.e('Dash').attr({_intensity: 200});

    // Platforms
    generateMap();

    // Wave
    var wave = Crafty.e('Wave')
            .setMetrics({x: -1900, y: 50, w: 1400}, {
                bodyType: 'kinematic',
                density : 10,
                friction : 30,
                restitution : 0,
                shape: [
                    [0, 80],
                    [1200, 80],
                    [1200, 680],
                    [0, 680]
                ]
            })
            .setSpeed(1.5);

    // Setup global events
    bindEvents();
}

function leaveGame() {
    unbindEvents();
}

Crafty.scene('Game', enterGame, leaveGame);

// Loading scene
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

function enterEnd() {
    Crafty.e('2D, DOM, Text')
        .attr({w: 500, h: 300, x: 150, y: 120})
        .text('Congrats, you have just cleared the final level! Press any key to restart.')
        .textFont({size: '50px', weight: 'bold'})
        .css(Game.textStyle);

    Crafty.background('url(http://www.reactiongifs.com/wp-content/uploads/2012/10/billmurray-seal.gif)');

    Crafty.addEvent('', Crafty.stage.elem, 'keydown', (ev) => {
        Crafty.scene('Game');
    });
}

Crafty.scene('End', enterEnd);
