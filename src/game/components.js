/* jshint esnext: true */
import Game from './game';
import _ from 'lodash';

function componentPlayer() {
    var that = {},
        init = function() {
            this.requires('2D, Canvas, SpriteAnimation, Box2D, Keyboard, sprite_player_good, Phase, Controllable')
                .reel('PlayerWalking', 750, 0, 0, 3)
                .animate('PlayerWalking', -1)
                .attr({y: -200})
                .setEvilSprite('sprite_player_evil')
                .setGoodSprite('sprite_player_good')
                .bind('changePhase', this.applyPhase)
                .controls(4)
                .box2d({
                    bodyType: 'dynamic',
                    density : 10,
                    friction : 30,
                    restitution : 0.1
                })
                .onContact('Solid', onContact);
        },
        onContact = function(data) {
            //console.log('onContact:', data);
        };

    that.init = init;
    return that;
}

Crafty.c('Player', componentPlayer());

function componentControllable() {
    var that = {},
        controls = function(speed) {
            this.bind('KeyDown', (ev) => {
                var vy = this.body.GetLinearVelocity().y,
                    vec = this.body.GetLinearVelocity();
                switch(ev.keyCode) {
                case Crafty.keys.LEFT_ARROW:
                    vec = new b2Vec2(-speed, vy);
                    break;
                case Crafty.keys.RIGHT_ARROW:
                    vec = new b2Vec2(speed, vy);
                    break;
                }

                this.body.SetLinearVelocity(vec);
            });

            return this;
        };

    that.controls = controls;
    return that;
}

Crafty.c('Controllable', componentControllable());

function componentSolid() {
    var that = {},
        init = function() {
            this.requires('2D, Canvas, Box2D');
        },
        setMetrics = function(props, optBox2DProps) {
            return this.attr(props)
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
            return this.attr({_evilSprite: sprite});
        },
        setGoodSprite = function(sprite) {
            return this.attr({_goodSprite: sprite});
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

function componentTool() {
    var that = {},
        init = function() {
            this.requires('Keyboard')
                .attr({
                    _cooldown: 5
                });
        },
        cooldown = function(seconds) {
            return this.attr({_cooldown: seconds});
        },
        action = function(fn) {
            return this.attr({_action: fn});
        },
        onKey = function(keyCode) {
            return this.bind('KeyDown', (ev) => {
                if (ev.keyCode === keyCode) {
                    this._action();
                }
            });
        };

    that.init = init;
    that.cooldown = cooldown;
    that.action = action;
    that.onKey = onKey;
    return that;
}

Crafty.c('Tool', componentTool());

function componentHook() {
    var that = {},
        init = function() {
            this.requires('Tool')
                .cooldown(10)
                .action(() => {
                    console.log('Action HOOKED! DUDIDOU!');
                })
                .onKey(Crafty.keys.ENTER);
        };

    that.init = init;
    return that;
}

Crafty.c('Hook', componentHook());

function componentDash() {
    var that = {},
        init = function() {
            this.requires('Tool')
                .cooldown()
                .action(() => {
                    console.log('DASHING! NICEINOU!');
                })
                .onKey(Crafty.keys.SPACE);
        };

    that.init = init;
    return that;
}

Crafty.c('Dash', componentDash());

// Helpers
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
