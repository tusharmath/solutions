/**
 * Created by tusharmathur on 6/7/15.
 */
"use strict";
var chai = require('chai'), _ = require('lodash');
var should = chai.should();
var u = require('../Utils');

describe('Utils', function () {
    var node = {
        val: 1, parent: {val: 2, parent: {val: 3, parent: null}}
    };

    describe("getParentAsIterable()", function () {
        it("iterates over parents", function () {
            var iterator = u.getParentAsIterable(node);
            iterator.next().value.val.should.equal(2);
            iterator.next().value.val.should.equal(3);
            iterator.next().done.should.be.ok;
        });
    });
    describe("eachOf()", function () {
        it("iterates over the list n times", function () {
            var count = [];
            u.eachOf(u.getParentAsIterable(node), function (node) {
                count.push(node.val);
            });
            count.should.deep.equal([2, 3]);
        });
    });
});