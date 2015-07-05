/* jshint esnext: true */
let Game = require('./game');
import {getEntitiesAt} from './helpers';

let globalEvents = {
    keydown: (e) => {
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
