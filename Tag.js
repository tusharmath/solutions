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
/**
 * Node of a tag tree
 * @class
 */
class Tag {
    constructor() {

        /**
         * Link to parent tag
         * @type {Tag}
         */
        this.parent = null;

        /**
         * Collection of children tags
         * @type {Tag[]}
         */
        this.children = [];

        /**
         * Attribute Collection
         * @type {Attribute[]}
         */
        this.attributes = [];

        /**
         * Search tags recursively by attributes, through the child nodes
         * @param {Attribute[]} search attributes
         * @returns {Tag[]}
         */
        this.findByAttributes = _.partial(this._createSearchStrategy, invokeOnChildren);

        /**
         * Search tags linearly by attributes, through its parent nodes
         * @param {Attribute[]} search attributes
         * @returns {Tag[]}
         */
        this.findParent = _.partial(this._createSearchStrategy, invokeOnParent);

        /**
         * Search tags recursively through the child nodes, return and caches the response
         * @param {Attribute[]} search attributes
         * @returns {Tag[]}
         */
        this.findByAttributesMemoized = _.memoize(this.findByAttributes, _.identity);
    }

    /**
     * Add a tag to another node as child
     * @param {Tag} tag
     */
    addChild(tag) {
        if (tag.parent) {
            throw Error("Can not re add a node");
        }
        tag.parent = this;
        this.children.push(tag);
    }

    /**
     * Create a search strategy
     * @param {Function} invokeOn
     * @param {Attribute[]} attributes
     * @private
     */
    _createSearchStrategy(invokeOn, attributes) {
        return recursiveFilter(invokeOn, _.partial(tagHasAllAttributes, attributes), [], this);
    }

    /**
     * Add an attribute by name to the tag
     * @param {String} name
     * @param {Object} value
     */
    addAttribute(name, value) {
        this.attributes.push(new Attribute(name, value));
    }

    /**
     * Remove an attribute by name from the tag
     * @param {String} name
     */
    removeAttribute(name) {
        _.remove(this.attributes, _.partial(matchKeyValueForObject, 'name', name));
    }
}
module.exports = Tag;