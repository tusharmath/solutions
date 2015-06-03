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

var nextNodeLinearSearch = function (cb, node) {
    cb(node.parent);
};

var nextNodeBFS = function (cb, node) {
    _.each(node.children, cb);
};
var recursiveSearch = function (searchStrategy, sieve, node, results) {
    results = results || [];
    if (!node) {
        return;
    }
    if (sieve(node)) {
        results.push(node);
    } else {
        searchStrategy(_.partial(recursiveSearchWithNodeAtLast, searchStrategy, sieve, results), node);
    }
    return results;
};

var recursiveSearchWithNodeAtLast = _.rearg(recursiveSearch, 0, 1, 3, 2);

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
        if (tag.parent) {
            throw Error("Can not re add a node");
        }
        tag.parent = this;
        this.children.push(tag);
    }

    addAttribute(name, value) {
        this.attributes.push(createTagAttribute(name, value));
    }

    findByAttribute(name, value) {
        return recursiveSearch(nextNodeBFS, _.partial(tagHasAttribute, {name, value}), this)
    }

    findByAttributes(attributes) {
        return recursiveSearch(nextNodeBFS, _.partial(tagHasAllAttributes, attributes), this)
    }

    findParent(attributes) {
        return recursiveSearch(nextNodeLinearSearch, _.partial(tagHasAllAttributes, attributes), this)
    }
}

module.exports = Tag;
