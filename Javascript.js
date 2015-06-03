"use strict";
var _ = require('lodash');

var createTagAttribute = function (name, value) {
    return {name, value};
};

var getFirstTransformation = function (collection, transformer) {
    var t, i;
    _.each(collection, function (i) {
        return _.isEmpty(t = transformer(i));
    });
    return t;
};

var bfs = function (validator, node, results) {
    results = results || [];
    var bfsWithValidator = _.partial(bfs, validator);
    if (validator(node)) {
        results.push(node);
    } else {
        _.map(node.children, function (child) {
            bfsWithValidator(child, results);
        })
    }
    return results;
};

var tagHasAttribute = function (searchAttribute, tag) {
    return _.any(tag.attributes, _.partial(_.isEqual, searchAttribute));
};
var tagHasAllAttributes = function (searchAttributes, tag) {
    return _.all(searchAttributes, _.partial(_.rearg(tagHasAttribute, 1, 0), tag));
};

class Tag {
    constructor() {
        this.children = [];
        this.attributes = [];
    }

    addChild(tag) {
        tag.parent = this;
        this.children.push(tag);
    }

    addAttribute(name, value) {
        this.attributes.push(createTagAttribute(name, value));
    }

    findByAttribute(name, value) {
        return bfs(_.partial(tagHasAttribute, {name, value}), this)
    }

    findByAttributes(attributes) {
        return bfs(_.partial(tagHasAllAttributes, attributes), this)
    }
}

module.exports = Tag;
