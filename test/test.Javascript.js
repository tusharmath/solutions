/**
 * Created by tusharmathur on 6/3/15.
 */
"use strict";
var chai = require('chai'), _ = require('lodash');
var should = chai.should();

var Tag = require('../Tag'),
    Attribute = require('../Attribute');

var attr = function (name, value) {
    return new Attribute(name, value);
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
});