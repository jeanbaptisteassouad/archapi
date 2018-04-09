const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
 
chai.use(chaiAsPromised)
const should = chai.should()


const T = require('./tree')


describe('Common Tree', function() {
  let tree
  let root_name = 'root_name'


  describe('#init', function() {
    it('should return an init tree', function() {
      tree = T.init(root_name)
      tree.should.deep.equal({
        name:root_name,
        size:0,
        children:[]
      })
    })
  })


  describe('#update', function() {
    it('should update correctly the tree', function() {
      T.update([root_name,'a','b','c'],1,tree)
      tree.should.deep.equal({
        name:root_name,
        size:1,
        children:[
          {
            name:'a',
            size:1,
            children:[
              {
                name:'b',
                size:1,
                children:[
                  {
                    name:'c',
                    size:1,
                    children:[]
                  }
                ]
              }
            ]
          }
        ]
      })
    })


    it('should update correctly the tree', function() {
      T.update([root_name,'a','b','d'],2,tree)
      tree.should.deep.equal({
        name:root_name,
        size:3,
        children:[
          {
            name:'a',
            size:3,
            children:[
              {
                name:'b',
                size:3,
                children:[
                  {
                    name:'c',
                    size:1,
                    children:[]
                  },
                  {
                    name:'d',
                    size:2,
                    children:[]
                  }
                ]
              }
            ]
          }
        ]
      })
    })


    it('should update correctly the tree', function() {
      T.update([root_name,'e'],3,tree)
      tree.should.deep.equal({
        name:root_name,
        size:6,
        children:[
          {
            name:'a',
            size:3,
            children:[
              {
                name:'b',
                size:3,
                children:[
                  {
                    name:'c',
                    size:1,
                    children:[]
                  },
                  {
                    name:'d',
                    size:2,
                    children:[]
                  }
                ]
              }
            ]
          },
          {
            name:'e',
            size:3,
            children:[]
          }
        ]
      })
    })


    it('should update correctly the tree', function() {
      T.update([root_name,'a','f'],4,tree)
      tree.should.deep.equal({
        name:root_name,
        size:10,
        children:[
          {
            name:'a',
            size:7,
            children:[
              {
                name:'b',
                size:3,
                children:[
                  {
                    name:'c',
                    size:1,
                    children:[]
                  },
                  {
                    name:'d',
                    size:2,
                    children:[]
                  }
                ]
              },
              {
                name:'f',
                size:4,
                children:[]
              }
            ]
          },
          {
            name:'e',
            size:3,
            children:[]
          }
        ]
      })
    })


  })

})
