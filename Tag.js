"use strict";
var _ = require('lodash'),
    u = require('./Utils'),
    TagAttribute = require('./TagAttribute');

/**
 * HTML Tag representation in a DOM tree
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
         * @type {function}
         * @returns {Tag[]}
         */
        this.findByAttributes = _.partial(this._createSearchStrategy, u.getChildrenAsIterable);

        /**
         * Search tags linearly by attributes, through its parent nodes
         * @param {TagAttribute[]} searchAttributes
         * @type {function}
         * @returns {Tag[]}
         */
        this.findParent = _.partial(this._createSearchStrategy, u.getParentAsIterable);

        /**
         * Search tags recursively through the child nodes, return and caches the response
         * @param {TagAttribute[]} searchAttributes
         * @type {function}
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
        return _.filter(u.treeToArray(generator, _.identity, this), _.partial(u.tagHasAllAttributes, attributes));
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
        _.remove(this.attributes, _.partial(u.hasValue, 'name', name));
    }

    /**
     * Converts the tree from the current node to a string that can be printed
     */
    toString() {
        return _.map(u.treeToArray(u.getChildrenAsIterable, u.printMapper, this), u.createNodePrintString).join('\n');
    }

    /**
     * Find an element using tree search
     * @param {...TagAttribute[]} attributeSelector
     */
    find(attributeSelector) {
        attributeSelector = _.toArray(arguments);
        return u.findTagInTree(this, attributeSelector);
    }
}
module.exports = Tag;