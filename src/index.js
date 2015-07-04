/* jshint esnext: true */
import Game from './game/game';

document.addEventListener('DOMContentLoaded', function() {
    require('./game/scenes.js');
    require('./game/components.js');
    Game.start();

    setTimeout(function() {
        var canvas = document.querySelector('#cr-stage > canvas');
        if (canvas) {
            canvas.setAttribute('tabindex', 1);
            canvas.focus();
        }

        canvas.addEventListener('blur', function() {
            canvas.focus();
        });
    }, 1000);
});
