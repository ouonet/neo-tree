(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.neo_tree = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by neo on 2015/10/9.
 */
'use strict';
var Tree = require('./lib/tree');
var TreeIterator = require('./lib/tree-iterator');
var DefaultTreeNodeInterpreter = require('./lib/default-tree-node-interpreter');
var TreeNode = require('./lib/tree-node');
module.exports.Tree = Tree;
module.exports.TreeIterator = TreeIterator;
module.exports.DefaultTreeNodeInterpreter = DefaultTreeNodeInterpreter;
module.exports.TreeNode = TreeNode;



},{"./lib/default-tree-node-interpreter":2,"./lib/tree":5,"./lib/tree-iterator":3,"./lib/tree-node":4}],2:[function(require,module,exports){
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
},{"./underscore-like":6,"neo_lang":11}],3:[function(require,module,exports){
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
},{"neo_iterator":7,"neo_lang":11}],4:[function(require,module,exports){
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
},{"./underscore-like":6,"neo_lang":11}],5:[function(require,module,exports){
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
},{"./default-tree-node-interpreter":2,"./tree-node":4,"./underscore-like":6,"neo_lang":11}],6:[function(require,module,exports){
/**
 * Created by neo on 2015/10/17.
 */
var _ = module.exports;
_.contains = function (arr, val) {
    for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] == val) {
            return true;
        }
    }
    return false;
};
_.each = function (arr, fun) {
    for (var i = 0, len = arr.length; i < len; i++) {
        fun.call(arr[i], arr[i]);
    }
};
_.map = function (arr, fun) {
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        result.push(fun.call(arr[i], arr[i]));
    }
    return result;
};

_.reject = function (arr, fun) {
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        if (!fun.call(arr[i], arr[i])) {
            result.push(arr[i]);
        }
    }
    return result;
};
},{}],7:[function(require,module,exports){
'use strict';
var Iterator=require('./lib/Iterator');
var ArrayIterator=require('./lib/ArrayIterator');
module.exports={
    Iterator:Iterator,
    ArrayIterator:ArrayIterator
};
},{"./lib/ArrayIterator":8,"./lib/Iterator":9}],8:[function(require,module,exports){
/**
 * Created by neo on 2015/10/7.
 */
'use strict';
var Iterator = require('./Iterator');
var neo = require('neo_lang');
/*
 Array 的iterator
 */
function ArrayIterator(data) {
    Iterator.apply(this, arguments);
    this._idx = -1;
    return this;
}
neo.extend(ArrayIterator, Iterator, {
    next: function () {
        if (this.eof)
            return null;
        this._idx = this._idx == -1 ? 0 : this._idx + 1;
        this.eof = this._idx >= this.data.length-1;
        this.current = this.data[this._idx];
        return this.current;
    },
    inquiryEnd: function (element) {
        if (this.data == undefined) {
            return true;
        }
        if (this.data.length == 0) {
            return true;
        }
        if (typeof element == 'undefined') {
            this._idx = -1;
            return false;
        }
        if (element == null) {
            this._idx = -1;
            return false;
        }
        this._idx = this.data.indexOf(element);
        return this._idx + 1 >= this.data.length;
    }
});

module.exports = ArrayIterator;
},{"./Iterator":9,"neo_lang":10}],9:[function(require,module,exports){
/**
 * Created by neo on 2015/10/7.
 */
/**
 * Created by neo on 2015/10/7.
 */
'use strict';
function Iterator(data) {
    this.data = data;
    this.current = null;
    this.eof = false;
    this.reset();
    return this;
}
var proto = Iterator.prototype;
proto.reset = function () {
    this.setCurrent(null);
    return this;
};
proto.getCurrent = function () {
    return this.current;
};
proto.setCurrent = function (current) {
    this.current = current;
    this.eof = this.inquiryEnd(this.current);
};
proto.hasNext = function () {
    return !this.eof;
};
proto.inquiryEnd = function (element) {
    return true;
};
proto.next = function () {
    this.eof = true;
    return null;
};
module.exports = Iterator;
},{}],10:[function(require,module,exports){
/**
 * Created by neo on 2015/10/7.
 */
'use strict';
var extend = (function () {
    // inline overrides
    var ua = typeof navigator == "object" && (typeof navigator.userAgent == 'string' )
            ? navigator.userAgent.toLowerCase() : "",
        check = function (r) {
            return r.test(ua);
        },
        isOpera = check(/opera/),
        isIE = !isOpera && check(/msie/),
        apply = function (o, c, defaults) {
            // no "this" reference for friendly out of scope calls
            if (defaults) {
                apply(o, defaults);
            }
            if (o && c && typeof c == 'object') {
                for (var p in c) {
                    o[p] = c[p];
                }
            }
            return o;
        },
        io = function (o) {
            for (var m in o) {
                this[m] = o[m];
            }
        },
        override = function (origclass, overrides) {
            if (overrides) {
                var p = origclass.prototype;
                apply(p, overrides);
                if (isIE && overrides.hasOwnProperty('toString')) {
                    p.toString = overrides.toString;
                }
            }
        },
        oc = Object.prototype.constructor;

    return function (sb, sp, overrides) {
        if (typeof sp == 'object') {
            overrides = sp;
            sp = sb;
            sb = overrides.constructor != oc ? overrides.constructor : function () {
                sp.apply(this, arguments);
            };
        }
        var F = function () {
            },
            sbp,
            spp = sp.prototype;

        F.prototype = spp;
        sbp = sb.prototype = new F();
        sbp.constructor = sb;
        sb.superclass = spp;
        if (spp.constructor == oc) {
            spp.constructor = sp;
        }
        sb.override = function (o) {
            override(sb, o);
        };
        sbp.superclass = sbp.supr = (function () {
            return spp;
        });
        sbp.override = io;
        override(sb, overrides);
        sb.extend = function (o) {
            return extend(sb, o);
        };
        return sb;
    };
})();

module.exports.extend=extend;
},{}],11:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}]},{},[1])(1)
});
//# sourceMappingURL=neo_tree.js.map
