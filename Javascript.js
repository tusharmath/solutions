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

var invokeOnParent = function (cb, node) {
    cb(node.parent);
};

var invokeOnChildren = function (cb, node) {
    _.each(node.children, cb);
};
var recursiveSearch = function (searchStrategy, sieve, results, node) {
    if (!node) {
        return;
    }
    if (sieve(node)) {
        results.push(node);
    } else {
        searchStrategy(_.partial(recursiveSearch, searchStrategy, sieve, results), node);
    }
    return results;
};

var tagHasAttribute = function (searchAttribute, tag) {
    return _.any(tag.attributes, _.partial(_.isEqual, searchAttribute));
};
var tagHasAllAttributes = function (searchAttributes, tag) {
    return _.all(searchAttributes, _.partial(_.rearg(tagHasAttribute, 1, 0), tag));
};

var extracted = function (attributes, searchStrategy) {
    return recursiveSearch(searchStrategy, _.partial(tagHasAllAttributes, attributes), [], this);
};
class Tag {
    constructor() {
        this.children = [];
        this.attributes = [];

        this.findByAttributes = _.partial(this._createSearchStrategy, invokeOnChildren);
        this.findParent = _.partial(this._createSearchStrategy, invokeOnParent);
    }

    addChild(tag) {
        if (tag.parent) {
            throw Error("Can not re add a node");
        }
        tag.parent = this;
        this.children.push(tag);
    }

    _createSearchStrategy(searchStrategy, attributes) {
        return recursiveSearch(searchStrategy, _.partial(tagHasAllAttributes, attributes), [], this);
    }

    addAttribute(name, value) {
        this.attributes.push(createTagAttribute(name, value));
    }

    findByAttribute(name, value) {
        return recursiveSearch(invokeOnChildren, _.partial(tagHasAttribute, {name, value}), [], this)
    }
}

module.exports = Tag;
