/* jshint esnext: true */
let Game = require('./game');
import _ from 'lodash';
import {objAssets, generateMap} from './assets';
import {bindEvents, unbindEvents} from './events';
import {getEntitiesAt} from './helpers';

// Game scene
function enterGame() {
    // Player
    var p = Crafty.e('Player')
            .controls(4)
            .setMetrics({x: 300, y: 320}, {
                bodyType: 'dynamic',
                density : 10,
                friction : 30,
                restitution : 0.1
            });
    Crafty.viewport.follow(p);

    // Tools
    Crafty.e('Hook');
    Crafty.e('Dash');

    // Platforms
    generateMap();

    // Wave
    Crafty.e('Wave')
        .setMetrics({x: -220, y: 80, h: 500, w: 200}, {
            bodyType: 'kinematic',
            density : 10,
            friction : 30,
            restitution : 0
        })
        .setSpeed(1);

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
