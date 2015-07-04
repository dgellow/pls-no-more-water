/* jshint esnext: true */
import Game from './game';
import _ from 'lodash';

function componentPlayer() {
    var that = {},
        init = function() {
            this.requires('2D, Canvas, SpriteAnimation, Box2D, sprite_player_good, Twoway, Phase')
                .reel('PlayerWalking', 750, 0, 0, 3)
                .animate('PlayerWalking', -1)
                .attr({y: -200})
                .twoway(4, 7)
                .setEvilSprite('sprite_player_evil')
                .setGoodSprite('sprite_player_good')
                .bind('changePhase', this.applyPhase)
                .box2d({
                    bodyType: 'dynamic',
                    density : 10,
                    friction : 30,
                    restitution : 0.1
                })
                .onContact('Solid', onContact);
        },
        onContact = function(data) {
            console.log('onContact:', data);
        };

    that.init = init;
    return that;
}

Crafty.c('Player', componentPlayer());

function componentSolid() {
    var that = {},
        init = function() {
            this.requires('2D, Canvas, Box2D');
        },
        setMetrics = function(props, optBox2DProps) {
            this.attr(props)
                .box2d(optBox2DProps || {
                    bodyType: 'static',
                    density: 1.0,
                    friction: 0,
                    restitution: 0
                });
        };

    that.init = init;
    that.setMetrics = setMetrics;
    return that;
}

Crafty.c('Solid', componentSolid());

function componentPlatform() {
    var that = {},
        init = function() {
            this.requires('Solid, Phase, sprite_platform_good')
                .setEvilSprite('sprite_platform_evil')
                .setGoodSprite('sprite_platform_good')
                .bind('changePhase', this.applyPhase);
        };

    that.init = init;
    return that;
}

Crafty.c('Platform', componentPlatform());

function componentPhase() {
    var that = {},
        setEvilSprite = function(sprite) {
            this._evilSprite = sprite;
            return this;
        },
        setGoodSprite = function(sprite) {
            this._goodSprite = sprite;
            return this;
        },
        applyPhase = function(phase) {
            console.log('Phase: ', phase);
            if (phase == "evil") {
                swapSprite(this, this._evilSprite);
            } else {
                swapSprite(this, this._goodSprite);
            }
            return this;
        };

    that.applyPhase = applyPhase;
    that.setGoodSprite = setGoodSprite;
    that.setEvilSprite = setEvilSprite;
    return that;
}

Crafty.c('Phase', componentPhase());

function swapSprite(entity, newSprite) {
    let {w, h} = entity;

    _.chain(_.keys(entity.__c))
        .filter((c) => {
            return c.substring(0, 7) === 'sprite_';
        })
        .forEach((c) => {
            console.log('Component:', c);
            entity.removeComponent(c, false);
        });

    entity.requires(newSprite);
    entity.attr({w, h});
    return entity;
}
