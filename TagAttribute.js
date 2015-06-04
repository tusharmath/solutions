/**
 * Created by tusharmathur on 6/3/15.
 */
"use strict";
/**
 * Attribute class
 * @class
 * @type {TagAttribute}
 */
module.exports = class TagAttribute {
    /**
     * Constructor
     * @param {string} name
     * @param {object} value
     */
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.equals = this.equals.bind(this);
    }

    /**
     * Check for equality of {attribute}
     * @param {TagAttribute} attribute
     * @returns {boolean}
     */
    equals(attribute) {
        return attribute.name === this.name && attribute.value === this.value;
    }

    /**
     * Converts the attribute to string
     * @returns {string}
     */
    toString() {
        return '[Attribute(' + [this.name, this.value].join(', ') + ')]'
    }
};