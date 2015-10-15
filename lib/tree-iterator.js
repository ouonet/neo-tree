/**
 * Created by neo on 2015/10/9.
 */
'use strict';
var neo = require('neo-lang');
var Iterator = require('neo-iterator').Iterator;

/*
 节点以树的方式遍历
 */
function TreeIterator(tree) {
    Iterator.apply(this,arguments);
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
        hasNext: function () {
            return this.__findNext() != null;
        },
        next: function () {
            if (this.eof)
                return null;
            this.current = this.__findNext();
            if (this.current == null) {
                this.eof = true;
            }
            return this.current;
        },
        __findNext: function () {
            var tree = this.data;
            var current = this.current;
            if (this.eof)
                return null;
            if (current == null) {
                return tree;
            } else {
                if (current.children.length > 0) {
                    return current.children[0];
                } else if (current.next().length > 0) {
                    return current.next()[0];
                } else {
                    return this.__findParent(current);
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
module.exports=TreeIterator;