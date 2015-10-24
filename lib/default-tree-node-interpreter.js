/**
 * Created by neo on 2015/10/9.
 */
var neo = require('neo_lang');
var _ = require('./underscore-like');

var DefaultTreeNodeInterpreter = neo.extend(Object, {
    constructor: function () {
        this.rootIdValues = [-1];
        this.idField = 'id';
        this.parentIdField = 'parent_id';
        this.nameField = 'name';
        DefaultTreeNodeInterpreter.superclass.constructor.call(this);
        return this;
    },
    isRoot: function (node) {
        return _.contains(this.rootIdValues, node.data[this.idField]);
    },
    isChild: function (parent, child) {
        return parent.data[this.idField] == child.data[this.parentIdField];
    },
    isParent: function (child, parent) {
        return isChild(parent, child);
    },
    id: function (node) {
        return node.data[this.idField];
    },
    parent_id: function () {
        return node.data[this.parentIdField];
    },
    name: function (node) {
        return node.data[this.nameField];
    }
});

module.exports=DefaultTreeNodeInterpreter;