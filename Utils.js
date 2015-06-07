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
 * @param {{parent: Object}} node
 */
u.getParentAsIterable = function * (node) {
    while (node.parent) {
        node = node.parent;
        yield node;
    }
};

/**
 * Generator to get the child nodes
 * @param {{children: Array}} node
 * @yield {Tag}
 */
u.getChildrenAsIterable = function * (node) {
    if (node) {
        yield * node.children;
    }
};

u.getListAsIterable = function * (list) {
    yield * list;
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
 * Maps an iterable
 * @param {Symbol.iterator} iterator
 * @param {function} action
 */
u.mapOf = function (iterator, action) {
    var results = [], index = 0;
    u.eachOf(iterator, function (item) {
        results.push(action(item, index++));
    });
    return results;
};


/**
 * Filters an iterable
 * @param {Symbol.iterator} iterator
 * @param {function} sieve
 */
u.anyOf = function (iterator, sieve) {
    for (var val of iterator) {
        if(sieve(val)){
            return true;
        }
    }
    return false;
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
 * @param {Tag} node
 * @param {object} params
 * @returns {{prefix: string, isTail: boolean, node: Tag}}
 */
u.printMapper = function (node, params) {
    var parent = node.parent, prefix, isTail;
    if (!parent) {
        isTail = true;
    } else {
        isTail = node === _.last(parent.children)
    }
    if (!params) {
        prefix = '';
    } else {
        prefix = params.prefix + (params.isTail ? "    " : "│   ")
    }
    return {prefix, isTail, node};
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