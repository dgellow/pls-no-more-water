/* jshint esnext: true */
function componentPlayer() {
    var that = {},
        init = function() {
            this.requires('2D, Canvas, SpriteAnimation, sprite_player, Collision, Gravity, Twoway')
                .checkHits('Solid')
                .bind('HitOn', bindHitOn)
                .bind('HitOff', bindHitOff)
                .reel('PlayerWalking', 750, 0, 0, 3)
                .animate('PlayerWalking', -1)
                .gravity('Solid')
                .gravityConst(0.4)
                .twoway(4, 7);
        },
        bindHitOn = function(data) {
            console.log("Hit on");
            console.log(data);
        },
        bindHitOff = function(component) {
            console.log("Hit off");
            console.log(component);
        };

    that.init = init;
    return that;
}

Crafty.c('Player', componentPlayer());

function componentSolid() {
    var that = {},
        init = function() {
            this.requires('2D, Canvas, Collision, sprite_platform')
                .attr({h: 21})
                .collision();
        };

    that.init = init;
    return that;
}

Crafty.c('Solid', componentSolid());
