/**
 * Created by tusharmathur on 6/7/15.
 */
"use strict";
var chai = require('chai'), _ = require('lodash');
var should = chai.should();
var u = require('../Utils');

describe('Utils', function () {
    var parental = {
        val: 1, parent: {val: 2, parent: {val: 3, parent: null}}
    };
    var children = {
        val: 0,
        children: [
            {children: [], val: 1},
            {children: [], val: 2},
            {children: [], val: 3},
            {
                children: [
                    {children: [], val: 5},
                    {children: [], val: 6}
                ], val: 4
            }
        ]
    };

    describe("getParentAsIterable()", function () {
        it("iterates over parents", function () {
            var iterator = u.getParentAsIterable(parental);
            iterator.next().value.val.should.equal(2);
            iterator.next().value.val.should.equal(3);
            iterator.next().done.should.be.ok;
        });
    });

    describe("getChildrenAsIterableWithDepth()", function () {
        it("iterates over parents", function () {
            var iterator = u.getChildrenAsIterableWithDepth(children);
            var a = iterator.next().value;
            a.node.val.should.equal(0);
            a.depth.should.equal(0);

            iterator.next().value.node.val.should.equal(1);
            iterator.next().value.node.val.should.equal(2);
            iterator.next().value.node.val.should.equal(3);
            iterator.next().value.node.val.should.equal(4);
            iterator.next().value.node.val.should.equal(5);
            var b = iterator.next().value;
            b.node.val.should.equal(6);
            b.depth.should.equal(2);
            iterator.next().done.should.be.ok;
        });
    });
    describe("eachOf()", function () {
        it("iterates over the list n times", function () {
            var count = [];
            u.eachOf(u.getParentAsIterable(parental), function (node) {
                count.push(node.val);
            });
            count.should.deep.equal([2, 3]);
        });
    });
});