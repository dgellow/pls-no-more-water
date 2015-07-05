/* jshint esnext: true */
let Game = require('./game');
import _ from 'lodash';
import {objAssets, generateMap} from './assets';
import {bindEvents, unbindEvents} from './events';
import {getEntitiesAt} from './helpers';

// Intro scene
function enterIntro() {
    Crafty.e('2D, Canvas, Image')
        .attr({w: Crafty.viewport.width, h: Crafty.viewport.height})
        .image('assets/intro_title.png');

    Crafty.addEvent('', Crafty.stage.elem,
                    'keydown', Crafty.scene.bind(null, 'HelpGood'));
}

function leaveIntro() {
    Crafty.removeEvent('', Crafty.stage.elem,
                       'keydown', Crafty.scene.bind(null, 'HelpGood'));
}

Crafty.scene('Intro', enterIntro, leaveIntro);

// Help good scene
function enterHelpGood() {
    Crafty.e('2D, Canvas, Image')
        .attr({w: Crafty.viewport.width, h: Crafty.viewport.height})
        .image('assets/intro_help_good.png');

    Crafty.addEvent('', Crafty.stage.elem,
                    'keydown', Crafty.scene.bind(null, 'HelpEvil'));
}

function leaveHelpGood() {
    Crafty.removeEvent('', Crafty.stage.elem,
                       'keydown', Crafty.scene.bind(null, 'HelpEvil'));
}

Crafty.scene('HelpGood', enterHelpGood, leaveHelpGood);

// Help evil scene
function enterHelpEvil() {
    Crafty.e('2D, Canvas, Image')
        .attr({w: Crafty.viewport.width, h: Crafty.viewport.height})
        .image('assets/intro_help_evil.png');

    Crafty.addEvent('', Crafty.stage.elem,
                    'keydown', Crafty.scene.bind(null, 'Game'));
}

function leaveHelpEvil() {
    Crafty.removeEvent('', Crafty.stage.elem,
                       'keydown', Crafty.scene.bind(null, 'Game'));
}

Crafty.scene('HelpEvil', enterHelpEvil, leaveHelpEvil);

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
    Crafty.scene('Intro');
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
