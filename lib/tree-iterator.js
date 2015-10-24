/**
 * Created by neo on 2015/10/9.
 */
'use strict';
var neo = require('neo_lang');
var Iterator = require('neo_iterator').Iterator;

/*
 节点以树的方式遍历
 */
function TreeIterator(tree) {
    Iterator.apply(this, arguments);
    return this;
}
neo.extend(TreeIterator, Iterator,
    {
        getDeep: function () {
            if (this.current == null) {
                return -1;
            }
            return this.current.parents().length;
        },
        next: function () {
            if (this.eof)
                return null;
            var nextNode = this.__findNext(this.current);
            if (nextNode == null) {
                this.eof = true;
            }else{
                this.eof=this.__findNext(nextNode)==null;
            }
            this.current=nextNode;
            return this.current;
        },
        inquiryEnd: function (element) {
            return this.__findNext(element) == null;
        },
        __findNext: function (element) {
            var tree = this.data;
            if (element == null) {
                return tree;
            } else {
                if (element.children.length > 0) {
                    return element.children[0];
                } else if (element.next().length > 0) {
                    return element.next()[0];
                } else {
                    return this.__findParent(element);
                }
            }
        },
        __findParent: function (child) {
            if (child.parent == null) {
                return null;
            } else if (child.parent.next().length > 0) {
                return child.parent.next()[0];
            } else return this.__findParent(child.parent);
        }
    }
);
module.exports = TreeIterator;