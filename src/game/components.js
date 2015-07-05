/* jshint esnext: true */
import Game from './game';
import _ from 'lodash';
import {swapSprite} from './helpers';

function componentPlayer() {
    var that = {},
        init = function() {
            this.requires('Solid, sprite_player_good, Phase, Controllable')
                .setEvilSprite('sprite_player_evil')
                .setGoodSprite('sprite_player_good')
                .onContact('Wave', hitWave);
        },
        hitWave = function(data) {
            Crafty.stage.elem
                .dispatchEvent(new Event('playerdie'));
        };

    that.init = init;
    return that;
}

Crafty.c('Player', componentPlayer());

function componentJump() {
    var that = {},
        init = function() {
            this.requires('Tool, RespondToMouseDown, Phase')
                .setCooldownDuration(350)
                .setAction((ev) => {
                    if (this._usable) {
                        var player = Crafty('Player'),
                            vec = new b2Vec2(0, -this._intensity);

                        player.body.ApplyImpulse(
                            vec, player.body.GetWorldCenter()
                        );

                        this.runCooldown();
                    }
                })
                .setPhaseCallback((phase) => {
                    if (phase === 'evil') {
                        this.attr({_usable: false});
                        this.removeComponent('RespondToMouseDown', true);
                    } else {
                        this.attr({_usable: true});
                        document.querySelector('#tool-ui .cooldown')
                            .innerHTML = 'Usable';
                        document.querySelector('#tool-ui h2')
                            .innerHTML = 'JET PACK';

                        this.addComponent('RespondToMouseDown');
                    }
                });
        };

    that.init = init;
    return that;
}

Crafty.c('Jump', componentJump());

function componentControllable() {
    var that = {},
        controls = function(force) {
            this.bind('KeyDown', (ev) => {
                var vec = this.body.GetLinearVelocity(),
                    vy = vec.y;

                switch(ev.keyCode) {
                case Crafty.keys.LEFT_ARROW:
                    vec = new b2Vec2(-force, vy);
                    break;
                case Crafty.keys.RIGHT_ARROW:
                    vec = new b2Vec2(force, vy);
                    break;
                }
                this.body.ApplyForce(
                    vec,
                    this.body.GetWorldCenter()
                );
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
            let interval = setInterval(progressCooldown.bind(this),
                                       timeframe);
            setTimeout(() => {
                clearInterval(interval);
                this.currentDuration = this.cooldownDuration;
                this.endCallback(endParams);
            }, this.cooldownDuration);
        },
        progressCooldown = function() {
            this.currentDuration -= timeframe;
            this.progressCallback(this.getProgress(),
                                  this.cooldownDuration);
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
        setProgressCallback = function(cb) {
            return this.attr({progressCallback: cb});
        },
        getProgress = function() {
            return this.currentDuration / this.cooldownDuration;
        };

    that.runCooldown = runCooldown;
    that.setCooldownDuration = setCooldownDuration;
    that.setInitialCallback = setInitialCallback;
    that.setEndCallback = setEndCallback;
    that.setProgressCallback = setProgressCallback;
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
        setPhaseCallback = function(cb) {
            return this.attr({phaseCallback: cb});
        },
        applyPhase = function(phase) {
            if (this._evilSprite && this._goodSprite)  {
                if (phase == "evil") {
                    swapSprite(this, this._evilSprite);
                } else {
                    swapSprite(this, this._goodSprite);
                }
            }

            if (this.phaseCallback) {
                this.phaseCallback(phase);
            }

            return this;
        };

    that.init = init;
    that.setGoodSprite = setGoodSprite;
    that.setEvilSprite = setEvilSprite;
    that.setPhaseCallback = setPhaseCallback;
    return that;
}

Crafty.c('Phase', componentPhase());

function componentCustomMouseDown() {
    var that = {},
        init = function() {
            this.bind('customMouseDown', performAction);
        },
        remove = function() {
            this.unbind('customMouseDown', performAction);
        },
        setAction = function(fn) {
            return this.attr({_performAction: fn});
        },
        performAction = function(ev) {
            this._performAction(ev);
        };
    that.init = init;
    that.remove = remove;
    that.setAction = setAction;
    return that;
}

Crafty.c('RespondToMouseDown', componentCustomMouseDown());

function componentTool() {
    var that = {},
        init = function() {
            this.requires('2D, Keyboard, Cooldown')
                .attr({_usable: true})
                .setProgressCallback((progress, total) => {
                    document.querySelector('#tool-ui .cooldown')
                        .innerHTML = progress * (total / 1000);
                })
                .setInitialCallback(() => {
                    this._usable = false;
                    document.querySelector('#tool-ui .cooldown')
                        .innerHTML = this.cooldownDuration / 1000;
                })
                .setEndCallback(() => {
                    this._usable = true;
                    document.querySelector('#tool-ui .cooldown')
                        .innerHTML = 'Usable';
                });
        };
    that.init = init;
    return that;
}

Crafty.c('Tool', componentTool());

function componentDash() {
    var that = {},
        init = function() {
            this.requires('Tool, RespondToMouseDown, Phase')
                .attr({_usable: false})
                .setCooldownDuration(2000)
                .setAction((ev) => {
                    if (this._usable) {
                        var mouseX = ev.offsetX - Crafty.viewport.x,
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
                .setPhaseCallback((phase) => {
                    if (phase === 'evil') {
                        this.attr({_usable: true});
                        this.addComponent('RespondToMouseDown');
                        document.querySelector('#tool-ui .cooldown')
                            .innerHTML = 'Usable';
                        document.querySelector('#tool-ui h2')
                            .innerHTML = 'DASH';
                    } else {
                        this.attr({_usable: false});
                        this.removeComponent('RespondToMouseDown', true);
                    }
                });
        };

    that.init = init;
    return that;
}

Crafty.c('Dash', componentDash());

function componentWave() {
    var that = {},
        init = function() {
            this.requires('Solid, SpriteAnimation, sprite_wave_good, Phase')
                .reel('WaveAnimation', 500, [[0, 0], [0, 1], [0, 2]])
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
