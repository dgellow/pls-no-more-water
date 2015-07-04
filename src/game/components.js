/* jshint esnext: true */
import Game from './game';
import _ from 'lodash';
import {swapSprite} from './helpers';

function componentPlayer() {
    var that = {},
        init = function() {
            this.requires('Solid, SpriteAnimation, Keyboard, sprite_player_good, Phase, Controllable')
                .reel('PlayerWalking', 750, 0, 0, 3)
                .animate('PlayerWalking', -1)
                .setEvilSprite('sprite_player_evil')
                .setGoodSprite('sprite_player_good')
                .onContact('Wave', hitWave);
        },
        hitWave = function(data) {
            console.log('Player#hitWave:', data);
        };

    that.init = init;
    return that;
}

Crafty.c('Player', componentPlayer());

function componentControllable() {
    var that = {},
        controls = function(speed) {
            this.bind('KeyDown', (ev) => {
                var vec = this.body.GetLinearVelocity(),
                    vy = vec.y;

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

            this.bind('KeyUp', (ev) => {
                var vec = this.body.GetLinearVelocity(),
                    vy = vec.y;
                switch(ev.keyCode) {
                case Crafty.keys.LEFT_ARROW:
                    vec = new b2Vec2(0, vy);
                    break;
                case Crafty.keys.RIGHT_ARROW:
                    vec = new b2Vec2(0, vy);
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

function componentCooldown() {
    let timeframe = 30;
    var that = {},
        runCooldown = function(initialParam, endParams) {
            this.initialCallback(initialParam);
            let interval = setInterval(progressCooldown, timeframe);
            let self = this;
            setTimeout(function() {
                clearInterval(interval);
                self.currentDuration = self.cooldownDuration;
                self.endCallback(endParams);
            }, this.cooldownDuration);
        },
        progressCooldown = function() {
            this.currentDuration -= timeframe;
        },
        setCooldownDuration = function(millis) {
            return this.attr({cooldownDuration: millis,
                              currentDuration: millis});
        },
        setInitialCallback = function(cb) {
            return this.attr({initialCallback: cb});
        },
        setEndCallback = function(cb) {
            return this.attr({endCallback: cb});
        },
        getProgress = function() {
            return this.currentDuration / this.cooldownDuration;
        };

    that.runCooldown = runCooldown;
    that.setCooldownDuration = setCooldownDuration;
    that.setInitialCallback = setInitialCallback;
    that.setEndCallback = setEndCallback;
    that.getProgress = getProgress;
    return that;
}

Crafty.c('Cooldown', componentCooldown());

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
            this.requires('Solid, Phase');
        };

    that.init = init;
    return that;
}

Crafty.c('Platform', componentPlatform());

function componentPhase() {
    var that = {},
        init = function() {
            this.bind('changePhase', applyPhase);
        },
        setEvilSprite = function(sprite) {
            return this.attr({_evilSprite: sprite});
        },
        setGoodSprite = function(sprite) {
            swapSprite(this, sprite);
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

    that.init = init;
    that.setGoodSprite = setGoodSprite;
    that.setEvilSprite = setEvilSprite;
    return that;
}

Crafty.c('Phase', componentPhase());

function componentCustomMouseDown() {
    var that = {},
        init = function() {
            this.bind('customMouseDown', performAction);
        },
        setAction = function(fn) {
            return this.attr({_performAction: fn});
        },
        performAction = function(ev) {
            this._performAction(ev);
        };
    that.init = init;
    that.setAction = setAction;
    return that;
}

Crafty.c('RespondToMouseDown', componentCustomMouseDown());

function componentTool() {
    var that = {},
        init = function() {
            this.requires('Keyboard, Cooldown')
                .attr({
                    _usable: true
                })
                .setCooldownDuration(2000)
                .setInitialCallback(() => { console.log('tool unusable');this._usable = false })
                .setEndCallback(() => { console.log('tool usable'); this._usable = true });
        };
    that.init = init;
    return that;
}

Crafty.c('Tool', componentTool());

function componentHook() {
    var that = {},
        init = function() {
            this.requires('Tool')
        };

    that.init = init;
    return that;
}

Crafty.c('Hook', componentHook());

function componentDash() {
    var that = {},
        init = function() {
            this.requires('Tool, RespondToMouseDown')
                .attr({_intensity: 500})
                .setAction((ev) => {
                    if (this._usable) {
                        let mouseX = ev.offsetX - Crafty.viewport.x,
                            mouseY = ev.offsetY - Crafty.viewport.y,
                            player = Crafty('Player'),
                            vec = new b2Vec2(mouseX - player.x,
                                             mouseY - player.y);
                        vec.Normalize();
                        vec.Multiply(this._intensity);

                        player.body.ApplyImpulse(
                            vec, player.body.GetWorldCenter()
                        );
                        this.runCooldown();
                    }
                })
        };

    that.init = init;
    return that;
}

Crafty.c('Dash', componentDash());

function componentWave() {
    var that = {},
        init = function() {
            this.requires('Solid, SpriteAnimation, sprite_wave_good, Phase')
                .reel('WaveAnimation', 350, 0, 0, 3)
                .animate('WaveAnimation', -1)
                .setGoodSprite('sprite_wave_good')
                .setEvilSprite('sprite_wave_evil');
        },
        setSpeed = function(speed) {
            this.body.SetLinearVelocity(new b2Vec2(speed, 0));
            return this;
        };

    that.init = init;
    that.setSpeed = setSpeed;
    return that;
}

Crafty.c('Wave', componentWave());
