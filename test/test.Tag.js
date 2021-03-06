/**
 * Created by tusharmathur on 6/3/15.
 */
"use strict";
var chai = require('chai'), _ = require('lodash');
var should = chai.should();

var Tag = require('../Tag'),
    Attribute = require('../TagAttribute');

var attr = function (name, value) {
    return new Attribute(name, value);
};
var create = function (name, value) {
    var t = new Tag();
    t.addAttribute(name, value);
    return t;
};
describe('Tag', function () {
    var rootTag;
    beforeEach(function () {
        rootTag = new Tag();
    });

    it("exists", function () {
        rootTag.should.be.an.instanceof(Tag);
    });
    describe("addTag()", function () {
        it("adds a tag to the root node", function () {
            var tag = new Tag();
            rootTag.addChild(tag);
            rootTag.children[0].should.equal(tag);
            tag.parent.should.equal(rootTag);
        });
    });
    describe("removeAttribute()", function () {
        var tag = new Tag();
        tag.addAttribute('a', 1);
        tag.removeAttribute('a');
        tag.attributes.length.should.equal(0);
    });

    describe("findByAttributes()", function () {

        it("find tags matching attribute", function () {
            var tag1 = new Tag(), tag2 = new Tag(), tag3 = new Tag();
            tag1.addChild(tag2);
            rootTag.addChild(tag1);
            rootTag.addChild(tag3);

            tag1.addAttribute('a1', 'v1');
            tag2.addAttribute('a2', 'v2');
            tag3.addAttribute('a3', 'v3');

            rootTag.findByAttributes([attr('a1', 'v1')]).should.deep.equal([tag1]);
            rootTag.findByAttributes([attr('a2', 'v2')]).should.deep.equal([tag2]);
            rootTag.findByAttributes([attr('a3', 'v3')]).should.deep.equal([tag3]);
        });

        it("find a tag by attribute(s)", function () {
            var tag1 = new Tag(), tag2 = new Tag(), tag3 = new Tag();
            tag1.addChild(tag2);
            rootTag.addChild(tag1);
            rootTag.addChild(tag3);

            tag1.addAttribute('a1', 'v1');
            tag2.addAttribute('a2', 'v2');
            tag2.addAttribute('a22', 'v22');
            tag3.addAttribute('a3', 'v3');
            tag3.addAttribute('a22', 'v22');

            rootTag.findByAttributes([attr('a1', 'v1')]).should.deep.equal([tag1]);
            rootTag.findByAttributes([attr('a2', 'v2'), attr('a22', 'v22')]).should.deep.equal([tag2]);
            rootTag.findByAttributes([attr('a2', 'v2'), attr('a23', 'v23')]).should.be.empty;
            rootTag.findByAttributes([attr('a3', 'v3')]).should.deep.equal([tag3]);
            rootTag.findByAttributes([attr('a22', 'v22')]).should.deep.equal([tag2, tag3]);
        });
    });

    describe("findParent()", function () {
        it("goes up till the root to find a match", function () {
            var tag1 = new Tag(), tag2 = new Tag(), tag3 = new Tag();
            rootTag.addChild(tag1);
            tag1.addChild(tag2);
            tag2.addChild(tag3);

            tag1.addAttribute('a1', 'v1');
            tag2.addAttribute('a2', 'v2');
            tag2.addAttribute('a22', 'v22');
            tag3.addAttribute('a3', 'v3');
            tag3.addAttribute('a22', 'v22');
            tag3.findParent([attr('a2', 'v2')]).should.deep.equal([tag2]);
        });

    });

    describe("findByAttributesMemoized()", function () {
        it("memoizes the elements", function () {
            var tag1 = new Tag();
            rootTag.addChild(tag1);
            tag1.addAttribute('a1', 'v1');
            rootTag.findByAttributesMemoized([attr('a1', 'v1')]).should.deep.equal([tag1]);
            tag1.removeAttribute('a1');
            rootTag.findByAttributesMemoized([attr('a1', 'v1')]).should.deep.equal([tag1]);
        });
    });
    describe("print()", function () {
        it("it prints the out put", function () {
            var output = [];
            var logger = function (str) {
                output.push(str);
            };
            var expectedOutput = [
                "└── [Attribute(a, 1)]",
                "    ├── [Attribute(b, 2)]",
                "    │   ├── [Attribute(c, 3)]",
                "    │   └── [Attribute(d, 4)]",
                "    └── [Attribute(e, 5)]"
            ].join('\n');
            var a = create('a', 1);
            var b = create('b', 2);
            var c = create('c', 3);
            var d = create('d', 4);
            var e = create('e', 5);

            a.addChild(b);
            b.addChild(c);
            b.addChild(d);
            a.addChild(e);
            a.toString().should.deep.equal(expectedOutput);
        });

    });

    describe("find()", function () {
        it("find the element going from right to left", function () {

            var a = create('a', 1),
                b = create('b', 2),
                c = create('c', 3),
                d = create('x', 4),
                e = create('x', 4);

            a.addChild(b),
                b.addChild(c),
                b.addChild(d),
                a.addChild(e);
            /**
             *      a(a,1)
             *          b(b,2)
             *              c(c,3)
             *              d(x,4)
             *          e(x,4)
             */
            a.find([attr('b', 2)]).should.deep.equal([b]);
            a.find([attr('x', 4)], [attr('b', 2)]).should.deep.equal([d]);
            a.find([attr('x', 4)], [attr('a', 1)]).should.deep.equal([d, e]);
            a.find([attr('c', 3)], [attr('b', 2)]).should.deep.equal([c]);
        });

    });
});
