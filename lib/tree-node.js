/**
 * Created by neo on 2015/10/10.
 */
var neo = require('neo_lang');
var _ = require('./underscore-like');

var TreeNode = neo.extend(Object, {
    constructor: function (tree, data) {
        this.data = data || {};
        this.tree = tree;
        this.parent = null;
        this.children = [];
        return this;
    },
    next: function () {
        var result = [];
        if (this.parent != null) {
            var i = this.parent.children.indexOf(this);
            result = this.parent.children.slice(i + 1);
        }
        return result;
    },
    parents: function () {
        var result = [];
        var p = this.parent;
        while (p != null) {
            result.unshift(p);
            p = p.parent;
        }
        return result;
    },
    isParent: function (node) {
        return this.tree.nodeInterpreter.isChild(this, node);
    },
    findParent: function (node) {
        if (this.isParent(node)) {
            return this;
        }
        for (var i = 0, len = this.children.length; i < len; i++) {
            var rslt = this.children[i].findParent(node);
            if (rslt != null)return rslt;
        }
        return null;
    },
    addChild: function (node) {
        this.children.push(node);
        node.parent = this;
        return this;
    },
    removeAllChildren: function () {
        _.each(this.children, function (node) {
            node.removeAllChildren();
        });
        this.children.splice(0);
    },
    id: function () {
        return this.tree.nodeInterpreter.id(this);
    },
    parent_id: function () {
        return this.tree.nodeInterpreter.parent_id(this);
    },
    name: function () {
        return this.tree.nodeInterpreter.name(this);
    },
    getChildrenDatas: function () {
        return _.map(this.children, function (node) {
            return node.data
        });
    },
    hasChildren: function () {
        return this.children.length > 0;
    }
});

module.exports = TreeNode;