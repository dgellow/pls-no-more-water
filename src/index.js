var Game = require('./game/game');

document.addEventListener('DOMContentLoaded', function() {
    require('./game/scenes.js');
    require('./game/components.js');
    Game.start();
});
