/**
 * Created by tusharmathur on 6/3/15.
 */
"use strict";
var chai = require('chai');
var should = chai.should();

var Tag = require('../Tag');
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

    describe("findByAttributes()", function () {
        it("find tags matching attribute", function () {
            var tag1 = new Tag(), tag2 = new Tag(), tag3 = new Tag();
            tag1.addChild(tag2);
            rootTag.addChild(tag1);
            rootTag.addChild(tag3);

            tag1.addAttribute('a1', 'v1');
            tag2.addAttribute('a2', 'v2');
            tag3.addAttribute('a3', 'v3');

            rootTag.findByAttributes([{name: 'a1', value: 'v1'}]).should.deep.equal([tag1]);
            rootTag.findByAttributes([{name: 'a2', value: 'v2'}]).should.deep.equal([tag2]);
            rootTag.findByAttributes([{name: 'a3', value: 'v3'}]).should.deep.equal([tag3]);
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

            rootTag.findByAttributes([{name: 'a1', value: 'v1'}]).should.deep.equal([tag1]);
            rootTag.findByAttributes([{name: 'a2', value: 'v2'}, {
                name: 'a22',
                value: 'v22'
            }]).should.deep.equal([tag2]);
            rootTag.findByAttributes([{name: 'a2', value: 'v2'}, {name: 'a23', value: 'v23'}]).should.be.empty;
            rootTag.findByAttributes([{name: 'a3', value: 'v3'}]).should.deep.equal([tag3]);
            rootTag.findByAttributes([{name: 'a22', value: 'v22'}]).should.deep.equal([tag2, tag3]);
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

            tag3.findParent([{name: 'a2', value: 'v2'}]).should.deep.equal([tag2]);
        });
    });
});