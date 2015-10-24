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