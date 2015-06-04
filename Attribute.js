/**
 * Created by tusharmathur on 6/3/15.
 */
"use strict";
/**
 * Attribute class
 * @class
 * @type {Attribute}
 */
module.exports = class Attribute {
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
     * @param {Attribute} attribute
     * @returns {boolean}
     */
    equals(attribute) {
        return attribute.name === this.name && attribute.value === this.value;
    }
};