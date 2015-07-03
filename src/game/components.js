/* jshint esnext: true */
import Game from './game';
import _ from 'lodash';

function componentPlayer() {
    var that = {},
        init = function() {
            this.requires('2D, Canvas, SpriteAnimation, sprite_player_good, Collision, Gravity, Twoway, Phase')
                .checkHits('Solid')
                .bind('HitOn', bindHitOn)
                .bind('HitOff', bindHitOff)
                .reel('PlayerWalking', 750, 0, 0, 3)
                .animate('PlayerWalking', -1)
                .gravity('Solid')
                .gravityConst(0.4)
                .twoway(4, 7)
                .setEvilSprite('sprite_player_evil')
                .setGoodSprite('sprite_player_good')
                .bind('changePhase', this.applyPhase);
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


//Phase Component
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
    console.log('Entity:', entity);
    _.chain(_.keys(entity.__c))
        .filter((c) => {
            return c.substring(0, 7) === 'sprite_';
        })
        .forEach((c) => {
            console.log('Component:', c);
            entity.removeComponent(c, false);
        });

    entity.requires(newSprite);
    return entity;
}
