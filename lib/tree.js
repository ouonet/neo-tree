/**
 * Created by neo on 2015/10/9.
 */
'use strict';
var neo = require('neo_lang');
var TreeNode = require('./tree-node');
var DefaultTreeNodeInterpreter = require('./default-tree-node-interpreter');
var _ = require('./underscore-like');

var Tree = TreeNode.extend({
    constructor: function (rootData, nodeInterpreter) {
        this.nodeInterpreter = nodeInterpreter || new DefaultTreeNodeInterpreter();
        Tree.superclass.constructor.call(this, this, rootData);
        this.nodes = [this];
        this._cacheP = null;//在新建树的时候，保存上次找到的父节点，可加快查找。大约可提高2倍。
        this.detaches = [];
        return this;
    },
    /*
     * 可乱序方式添加,不过按顺序加载(先父后子）最快，比乱序可能快一倍。
     * */
    add: function add(data) {
        var treeNode = new TreeNode(this, data);
        this.nodes.push(treeNode);
        var parent = null;
        if (this._cacheP !== null && this._cacheP.isParent(treeNode)) {
            //上次的父节点作为预测点
            this._cacheP.addChild(treeNode);
        } else if ((parent = this.findParent(treeNode)) != null) {
            //在主树中找到
            parent.addChild(treeNode);
            this._cacheP = parent;
        } else {
            for (var i = 0, len = this.detaches.length; i < len; i++) {
                if ((parent = this.detaches[i].findParent(treeNode)) != null) {
                    //在孤岛的树中找到
                    parent.addChild(treeNode);
                    this._cacheP = parent;
                    break;
                }
            }
        }
        //把孤岛的树尝试合并到本节点下
        this.detaches = _.reject(this.detaches, function (node) {
            if (treeNode.isParent(node)) {
                treeNode.addChild(node);
                return true;
            }
            return false;
        });
        if (treeNode.parent == null) {
            this.detaches.push(treeNode);
        }
        return this;
    },
    removeAll: function () {
        this.nodes.splice(1, this.nodes.length);
        this.removeAllChildren();
    },
    findNodeByData: function (data) {
        for (var i = 0, len = this.nodes.length; i < len; i++) {
            if (this.nodes[i].data == data) {
                return this.nodes[i];
            }
        }
        return null;
    },
    findNodeByName: function (name) {
        for (var i = 0, len = this.nodes.length; i < len; i++) {
            if (this.nodes[i].name() == name) {
                return this.nodes[i];
            }
        }
        return null;
    }
});
module.exports = Tree;