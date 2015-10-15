/**
 * Created by neo on 2015/10/10.
 */
var should = require('should');
var Tree = require('../lib/tree');
describe('tree', function () {
    it('build tree',function(){
        var tree=new Tree({id:-1,name:'root',parent_id:null});
        tree.data.should.have.property('id');
        tree.data.should.have.property('name');
        tree.data.should.have.property('parent_id');

        tree.add({id:0,name:'first',parent_id:-1});

    })
});