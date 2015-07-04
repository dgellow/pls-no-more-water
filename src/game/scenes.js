/* jshint esnext: true */
let Game = require('./game');
import _ from 'lodash';
<<<<<<< HEAD
import {objAssets} from './assets';
import {bindEvents, unbindEvents} from './events';
=======
import {getEntitiesAt} from './helpers';

let globalEvents = {
    keydown: (e) => {
        console.log(e);
        if (e.shiftKey) {
            Crafty.trigger('changePhase', Game.shiftPhase());
        }
    },
    mousedown: (ev) => {
        Crafty.trigger('customMouseDown', ev);
    },
    mousemove: (ev) => {
        var divDebug = document.getElementById('entity-debug');
        divDebug.style.display = 'block';
        divDebug.style.left = `${ev.x + 10}px`;
        divDebug.style.top = `${ev.y + 10}px`;
        divDebug.innerHTML = '';

        let entity = getEntitiesAt(
            ev.offsetX - Crafty.viewport.x,
            ev.offsetY - Crafty.viewport.y
        );
        if (entity) {
            divDebug.innerHTML = `Position<br>x: ${entity.x}<br>y: ${entity.y}`;
            divDebug.innerHTML += `<br>Size<br>h: ${entity.h}<br>w: ${entity.w}`;
            let velocity = entity.body.GetLinearVelocity();
            divDebug.innerHTML += `<br>Velocity<br>x: ${velocity.x}<br>y: ${velocity.y}`;
        }
    }
};
>>>>>>> added mouseDown listener

// Game scene
function enterGame() {
    // Player
    var p = Crafty.e('Player')
            .controls(4)
            .setMetrics({x: 100, y: -200}, {
                bodyType: 'dynamic',
                density : 10,
                friction : 30,
                restitution : 0.1
            });
    Crafty.viewport.follow(p);

    // Platforms
    Crafty.e('Platform')
        .setMetrics({x: 0, y: 0, w: 5000});

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
        .setSpeed(0);

    // Setup global events
    bindEvents();
}

function leaveGame() {
    unbindEvents();
}

Crafty.scene('Game', enterGame, leaveGame);

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
