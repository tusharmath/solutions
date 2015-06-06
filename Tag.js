"use strict";
var _ = require('lodash');
var TagAttribute = require('./TagAttribute');

var getParentAsIterable = function * (node) {
    yield node.parent;
};

var getChildrenAsIterable = function * (node) {
    yield * node.children;
};

var eachOf = function (iterator, action) {
    for (var val of iterator) {
        action(val);
    }
};

var createNodeName = function (params) {
    return params.prefix + (params.isTail ? "└── " : "├── ") + arraySerialize(params.node.attributes);
};

var printIterator = function (child, params, parent) {
    return {
        prefix: params.prefix + (params.isTail ? "    " : "│   "),
        isTail: child === _.last(parent.children),
        node: child
    };
};
var recursiveIterator = function (generator, iterator, results, node, params) {
    results.push(params);
    if (node) {
        eachOf(generator(node), function (child) {
            recursiveIterator(generator, iterator, results, child, iterator(child, params, node));
        });
    }
    return results;
};

var tagHasAttribute = function (searchAttribute, tag) {
    return tag && _.any(tag.attributes, searchAttribute.equals);
};
var tagHasAllAttributes = function (searchAttributes, tag) {
    return _.all(searchAttributes, _.partial(_.rearg(tagHasAttribute, 1, 0), tag));
};
var matchKeyValueForObject = function (key, value, obj) {
    return obj[key] === value;
};
var arraySerialize = function (list) {
    return _.invoke(list, 'toString').join(', ');
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
        this.findByAttributes = _.partial(this._createSearchStrategy, getChildrenAsIterable);

        /**
         * Search tags linearly by attributes, through its parent nodes
         * @param {TagAttribute[]} searchAttributes
         * @returns {Tag[]}
         */
        this.findParent = _.partial(this._createSearchStrategy, getParentAsIterable);

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
     * @param {Function} generator
     * @param {TagAttribute[]} attributes
     * @private
     */
    _createSearchStrategy(generator, attributes) {
        var attributeSieve = _.partial(tagHasAllAttributes, attributes);
        return _.filter(recursiveIterator(generator, _.identity, [], this, this), attributeSieve);
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
     * Converts the tree from the current node to an iterable array (DFS:Pre order)
     */
    toString() {
        return _.map(recursiveIterator(getChildrenAsIterable, printIterator, [], this, {
            isTail: true,
            prefix: '',
            node: this
        }), createNodeName).join('\n');
    }
}
module.exports = Tag;