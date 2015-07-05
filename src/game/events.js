/* jshint esnext: true */
let Game = require('./game');
import {getEntitiesAt} from './helpers';

let globalEvents = {
    collectItem: (ev) => {
        console.log('item collected');
        Crafty.trigger('HitOn', ev);
    },
    mousedown: (ev) => {
        // left click
        if (ev.which === 1) {
            Crafty.trigger('customMouseDown', ev);
        }

        // right click
        if (ev.which === 3) {
            let phase = Game.shiftPhase();
            Crafty.trigger('changePhase', phase);
            if (phase === 'evil') {
                Crafty.background('#422c14 url(assets/background_evil.png) repeat-x');
            } else {
                Crafty.background('#87b7e3 url(assets/background_good.png) repeat-x');
            }
        }

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
    },
    playerdie: (ev) => {
        Crafty.audio.play('you_are_dead');

        var world = Crafty.box2D.world;

        for (var b = world.GetBodyList(); b; b = b.GetNext()) {
	    world.DestroyBody(b);
	}

        setTimeout(() => {
            Crafty.audio.play('resurection');
            Crafty.scene('Game');
        }, 1000);
    },
    endgame: (ev) => {
        var world = Crafty.box2D.world;

        for (var b = world.GetBodyList(); b; b = b.GetNext()) {
	    world.DestroyBody(b);
	}

        Crafty.scene('End');
    }
};

export function bindEvents() {
    Object.keys(globalEvents).forEach((evName) => {
        Crafty.addEvent('', Crafty.stage.elem,
                        evName, globalEvents[evName]);
    });
}

export function unbindEvents() {
    Object.keys(globalEvents).forEach((evName) => {
        Crafty.removeEvent('', Crafty.stage.elem,
                           evName, globalEvents[evName]);
    });
}
