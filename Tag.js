"use strict";
var _ = require('lodash');
var Attribute = require('./Attribute');
var invokeOnParent = function (action, node) {
    action(node.parent);
};
var invokeOnChildren = function (action, node) {
    _.each(node.children, action);
};
var recursiveFilter = function (invokeOn, sieve, results, node) {
    var partialRecursion = _.partial(recursiveFilter, invokeOn, sieve, results);
    if (!node) {
        return [];
    }
    if (sieve(node)) {
        results.push(node);
    } else {
        invokeOn(partialRecursion, node);
    }
    return results;
};
var tagHasAttribute = function (searchAttribute, tag) {
    return _.any(tag.attributes, searchAttribute.equals);
};
var tagHasAllAttributes = function (searchAttributes, tag) {
    return _.all(searchAttributes, _.partial(_.rearg(tagHasAttribute, 1, 0), tag));
};
var matchKeyValueForObject = function (key, value, obj) {
    return obj[key] === value;
};
class Tag {
    constructor() {
        this.parent = null;
        this.children = [];
        this.attributes = [];
        this.findByAttributes = _.partial(this._createSearchStrategy, invokeOnChildren);
        this.findParent = _.partial(this._createSearchStrategy, invokeOnParent);
        this.findByAttributesMemoized = _.memoize(this.findByAttributes, _.identity);
    }

    addChild(tag) {
        if (tag.parent) {
            throw Error("Can not re add a node");
        }
        tag.parent = this;
        this.children.push(tag);
    }

    _createSearchStrategy(invokeOn, attributes) {
        return recursiveFilter(invokeOn, _.partial(tagHasAllAttributes, attributes), [], this);
    }

    addAttribute(name, value) {
        this.attributes.push(new Attribute(name, value));
    }

    removeAttribute(name) {
        _.remove(this.attributes, _.partial(matchKeyValueForObject, 'name', name));
    }
}
module.exports = Tag;