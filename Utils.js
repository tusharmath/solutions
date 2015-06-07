/**
 * Created by tusharmathur on 6/6/15.
 */
"use strict";
var u = {}, _ = require('lodash');
/**
 * Traverses the tree using a generator to get to the next node
 * @param {function} generator
 * @param {function} arrayMapper
 * @param {Tag} node
 * @param {object} params
 * @returns {Array}
 */
u.treeToArray = function (generator, arrayMapper, node, parentParams) {
    var results = [], params = arrayMapper(node, parentParams);
    results.push(params);
    u.eachOf(generator(node), function (child) {
        results = results.concat(u.treeToArray(generator, arrayMapper, child, params));
    });
    return results;
};
/**
 * Generator to get the parent node
 * @param {Tag} node
 */
u.getParentAsIterable = function * (node) {
    if (node) {
        yield node.parent;
    }
};

u.getListAsIterable = function * (list) {
    yield * list;
};

/**
 * Generator to get the child nodes
 * @param {Tag} node
 * @yield {Tag}
 */
u.getChildrenAsIterable = function * (node) {
    if (node) {
        yield * node.children;
    }
};

/**
 * Calls an action over each iteration
 * @param {Symbol.iterator} iterator
 * @param {function} action
 */
u.eachOf = function (iterator, action) {
    for (var val of iterator) {
        action(val);
    }
};

/**
 * Creates string to print the node
 * @param {Object} params
 * @returns {string}
 */
u.createNodePrintString = function (params) {
    return params.prefix + (params.isTail ? "└── " : "├── ") + u.arraySerialize(params.node.attributes);
};

/**
 * Mapper function for iterating over the tree
 * @param {Tag} child
 * @param {object} params
 * @param {Tag} parent
 * @returns {{prefix: string, isTail: boolean, node: Tag}}
 */
u.printMapper = function (child, params) {
    var parent = child.parent;
    if (!parent) {
        return {isTail: true, prefix: '', node: child};
    }
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
u.tagHasAttribute = function (searchAttribute, tag) {
    return tag && _.any(tag.attributes, searchAttribute.equals);
};
/**
 * Checks is all the attributes are present on a tag
 * @param {TagAttribute} searchAttributes
 * @param {Tag} tag
 * @returns {boolean}
 */
u.tagHasAllAttributes = function (searchAttributes, tag) {
    return _.all(searchAttributes, _.partial(_.rearg(u.tagHasAttribute, 1, 0), tag));
};

/**
 * Checks if {value} matches obj[key]
 * @param {string} key
 * @param {object} value
 * @param {object} obj
 * @returns {boolean}
 */
u.hasValue = function (key, value, obj) {
    return obj[key] === value;
};

/**
 * Serializes an array of attributes
 * @param {TagAttribute[]} list
 * @returns {string}
 */
u.arraySerialize = function (list) {
    return _.invoke(list, 'toString').join(', ');
};

module.exports = u;