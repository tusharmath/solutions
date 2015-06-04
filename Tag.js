"use strict";
var _ = require('lodash');
var TagAttribute = require('./TagAttribute');
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
         * TagAttribute Collection
         * @type {Array.<TagAttribute>}
         * @public
         */
        this.attributes = [];

        /**
         * Search tags recursively by attributes, through the child nodes
         * @param {TagAttribute[]} search attributes
         * @returns {Tag[]}
         */
        this.findByAttributes = _.partial(this._createSearchStrategy, invokeOnChildren);

        /**
         * Search tags linearly by attributes, through its parent nodes
         * @param {TagAttribute[]} searchAttributes
         * @returns {Tag[]}
         */
        this.findParent = _.partial(this._createSearchStrategy, invokeOnParent);

        /**
         * Search tags recursively through the child nodes, return and caches the response
         * @param {TagAttribute[]} searchAttributes
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
     * @param {TagAttribute[]} attributes
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
        this.attributes.push(new TagAttribute(name, value));
    }

    /**
     * Remove an attribute by name from the tag
     * @param {String} name
     */
    removeAttribute(name) {
        _.remove(this.attributes, _.partial(matchKeyValueForObject, 'name', name));
    }

    /**
     * Prints the tree from the current node
     * @param {string} prefix
     * @param {boolean} isTrail
     */
    print(prefix, isTail) {
        console.log(prefix + (isTail ? "└── " : "├── ") + _.map(this.attributes, function (c){return c.toString()}).join(', '));
        for (var i = 0; i < this.children.length - 1; i++) {
            this.children[i].print(prefix + (isTail ? "    " : "│   "), false);
        }
        if (this.children.length > 0) {
            this.children[this.children.length - 1].print(prefix + (isTail ? "    " : "│   "), true);
        }
    }
}
module.exports = Tag;