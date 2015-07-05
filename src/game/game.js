/* jshint esnext: true */
let gameProperties = {
    textStyle:  {
        'font-size': '24px',
        'font-family': 'Arial',
        'color': 'white',
        'text-align': 'center'
    },

    phase: 'good',

    player: {
        x: 5,
        y: 2
    }
};

function createGame(props) {
    var that = props,
        start = function() {
            Crafty.init(5000, 600);
            Crafty.viewport.init();
            Crafty.box2D.init(0, 7, 32, true);
            Crafty.scene('Loading');
        },
        shiftPhase = function() {
            that.phase = (that.phase == 'good') ? 'evil' : 'good';
            return that.phase;
        };

    that.start = start;
    that.shiftPhase = shiftPhase;
    return that;
}

module.exports = createGame(gameProperties);
