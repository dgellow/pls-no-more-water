/* jshint esnext: true */
let gameProperties = {
    textStyle:  {
        'font-size': '24px',
        'font-family': 'Arial',
        'color': 'white',
        'text-align': 'center'
    },

    player: {
        x: 5,
        y: 2
    }
};

function createGame(props) {
    var that = props,
        start = function() {
            Crafty.init(500, 1000);
            Crafty.viewport.init(667, 500);
            Crafty.scene('Loading');
        };

    that.start = start;
    return that;
}

module.exports = createGame(gameProperties);
