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

var linearSearchExtraction = function (sieve, node, results) {
    recursiveSearch(linearSearchExtraction, sieve, node.parent, results);
};

var breadthFirstSearchExtraction = function (sieve, node, results) {
    _.each(node.children, function (child) {
        recursiveSearch(breadthFirstSearchExtraction, sieve, child, results);
    });
};
var recursiveSearch = function (searchStrategy, sieve, node, results) {
    results = results || [];
    if (!node) {
        return;
    }
    if (sieve(node)) {
        results.push(node);
    } else {
        searchStrategy(sieve, node, results);
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
        return recursiveSearch(breadthFirstSearchExtraction, _.partial(tagHasAttribute, {name, value}), this)
    }

    findByAttributes(attributes) {
        return recursiveSearch(breadthFirstSearchExtraction, _.partial(tagHasAllAttributes, attributes), this)
    }

    findParent(attributes) {
        return recursiveSearch(linearSearchExtraction, _.partial(tagHasAllAttributes, attributes), this)
    }
}

module.exports = Tag;
