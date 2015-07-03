/* jshint esnext: true */
import Game from './game/game';

document.addEventListener('DOMContentLoaded', function() {
    require('./game/scenes.js');
    require('./game/components.js');
    Game.start();
});
