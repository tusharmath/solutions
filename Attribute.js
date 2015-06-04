/**
 * Created by tusharmathur on 6/3/15.
 */
"use strict";
module.exports = class Attribute {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.equals = this.equals.bind(this);
    }

    equals(attribute) {
        return attribute.name === this.name && attribute.value === this.value;
    }
};