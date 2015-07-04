/* jshint esnext: true */
import _ from 'lodash';

export function swapSprite(entity, newSprite) {
    let {w, h} = entity;

    _.chain(_.keys(entity.__c))
        .filter((c) => {
            return c.substring(0, 7) === 'sprite_';
        })
        .forEach((c) => {
            entity.removeComponent(c, false);
        });

    entity.requires(newSprite);
    entity.attr({w, h});
    return entity;
}

export function getEntitiesAt(x, y) {
    return _.find(Crafty('*').get(), function(e) {
        return (x >= e.x) &&
            (x <= e.x + e.w) &&
            (y >= e.y) &&
            (y <= e.y + e.h);
    });
}
