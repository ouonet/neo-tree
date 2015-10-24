/**
 * Created by neo on 2015/10/10.
 */
var should = require('should');
var Tree = require('../lib/tree');
var TreeIterator=require('../lib/tree-iterator');
describe('tree', function () {
    it('build tree',function(){
        var tree=new Tree({id:-1,name:'root',parent_id:null});
        tree.data.should.have.property('id');
        tree.data.should.have.property('name');
        tree.data.should.have.property('parent_id');

        tree.add({id:0,name:'first',parent_id:-1});

    })
});

describe('tree Iterator', function () {
    it('build tree',function(){
        var tree=new Tree({id:-1,name:'root',parent_id:null});
        tree.data.should.have.property('id');
        tree.data.should.have.property('name');
        tree.data.should.have.property('parent_id');

        tree.add({id:0,name:'first',parent_id:-1});
        tree.add({id:2,name:'second',parent_id:-1});
        tree.add({id:3,name:'1-1',parent_id:0});
        var tit=new TreeIterator(tree);
        should.equal(tit.hasNext(),true);
        should.equal(tit.next().data.name,"root");
        should.equal(tit.next().data.name,"first");
        should.equal(tit.next().data.name,"1-1");
        should.equal(tit.next().data.name,"second");
        should.equal(tit.hasNext(),false);
        //should.equal(tit.hasNext(),true);
    })
});