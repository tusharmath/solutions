"use strict";
var _ = require('lodash');
var TagAttribute = require('./TagAttribute');

/**
 * Traverses the tree using a generator to get to the next node
 * @param {function} generator
 * @param {function} arrayMapper
 * @param {Tag} node
 * @param {object} params
 * @returns {Array}
 */
var treeToArray = function (generator, arrayMapper, node, params) {
    var results = [];
    results.push(params);
    eachOf(generator(node), function (child) {
        results = results.concat(treeToArray(generator, arrayMapper, child, arrayMapper(child, params, node)));
    });
    return results;
};
/**
 * Generator to get the parent node
 * @param {Tag} node
 */
var getParentAsIterable = function * (node) {
    if (node) {
        yield node.parent;
    }
};

/**
 * Generator to get the child nodes
 * @param {Tag} node
 * @yield {Tag}
 */
var getChildrenAsIterable = function * (node) {
    if (node) {
        yield * node.children;
    }
};

/**
 * Calls an action over each iteration
 * @param {Symbol.iterator} iterator
 * @param {function} action
 */
var eachOf = function (iterator, action) {
    for (var val of iterator) {
        action(val);
    }
};

/**
 * Creates string to print the node
 * @param {Object} params
 * @returns {string}
 */
var createNodePrintString = function (params) {
    return params.prefix + (params.isTail ? "└── " : "├── ") + arraySerialize(params.node.attributes);
};

/**
 * Mapper function for iterating over the tree
 * @param {Tag} child
 * @param {object} params
 * @param {Tag} parent
 * @returns {{prefix: string, isTail: boolean, node: Tag}}
 */
var printMapper = function (child, params, parent) {
    return {
        prefix: params.prefix + (params.isTail ? "    " : "│   "),
        isTail: child === _.last(parent.children),
        node: child
    };
};
/**
 * Checks if {searchAttribute} is present on a tag
 * @param {TagAttribute} searchAttribute
 * @param {Tag} tag
 * @returns {boolean}
 */
var tagHasAttribute = function (searchAttribute, tag) {
    return tag && _.any(tag.attributes, searchAttribute.equals);
};
/**
 * Checks is all the attributes are present on a tag
 * @param {TagAttribute} searchAttributes
 * @param {Tag} tag
 * @returns {boolean}
 */
var tagHasAllAttributes = function (searchAttributes, tag) {
    return _.all(searchAttributes, _.partial(_.rearg(tagHasAttribute, 1, 0), tag));
};

/**
 * Checks if {value} matches obj[key]
 * @param {string} key
 * @param {object} value
 * @param {object} obj
 * @returns {boolean}
 */
var hasValue = function (key, value, obj) {
    return obj[key] === value;
};

/**
 * Serializes an array of attributes
 * @param {TagAttribute[]} list
 * @returns {string}
 */
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
        this.parent = _.noop();

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
        return _.filter(treeToArray(generator, _.identity, this, this), attributeSieve);
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
        _.remove(this.attributes, _.partial(hasValue, 'name', name));
    }

    /**
     * Converts the tree from the current node to an iterable array (DFS:Pre order)
     */
    toString() {
        return _.map(treeToArray(getChildrenAsIterable, printMapper, this, {
            isTail: true,
            prefix: '',
            node: this
        }), createNodePrintString).join('\n');
    }
}
module.exports = Tag;