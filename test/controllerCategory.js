import pkg from 'chai';
import Category from '../models/category.js'
import User from '../models/user.js'
import Hashtag from '../models/hashtag.js'
import Note from '../models/note.js'
import * as ControllerCategory from '../controllers/category.js'

const { expect} = pkg;
import chaiuse from 'chai-as-promised'
pkg.use(chaiuse)
import mongoose from 'mongoose'
import sinon from 'sinon'



describe('Auth Controller', function () {
    before(function (done) {
        mongoose.connect('mongodb://localhost:27017/test2')
            .then(result => {
                const user = new User({
                    email: 'test@test.com',
                    name: 'Test',
                    password: '$2a$12$xP8Y3beksZUpdQwcs12MEufvYexm7dmykrBOj8bTMsXEkc7Hfaiti',
                    posts: [],
                    _id: '5c0f66b979af55031b347282',
                    emailVerified: false,
                    userTokenExpires: Date.now() + 3600000,
                    wrongPassword: {
                        Attempt: 3,
                        Forbidden: false,
                        ForbiddenTime: 0
                    },
                    IpAddress: {
                        Ip: ["0.0.0.0"],
                        IpToken: '',
                        IpTokenExpires: 0,

                    }
                    ,
                    notes: []
                    ,
                    userToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzc2FmX3NlaWZAb3V0bG9vay5jb20iLCJ1c2VySWQiOiI2MmM5YTc1OTBlMTZjODBjZjhjZjhiMDYiLCJpYXQiOjE2NTczODUwNTgsImV4cCI6MTY1NzM4ODY1OH0.2Cj9UBoF_Pt0-9Nt5u4KAlIN5bxHlIoIDipeCrQdpBo'
                });
                return user.save();
            })
            // .then(result => {
                
            // })
            .then(result => {
                
                done()
            }).catch(err => console.log(err))
    })
  
    beforeEach(async function(){
        const category = new Category({
            _id:'5c0f66b979af55031b344862',
            title: 'tester',
            creator: '5c0f66b979af55031b347282',
            

        })
       await category.save()


        const newCat=new Category({
        title:'categorytest',
        _id:'5c0f66b979af55031b347843',
        creator: '5c0f66b979af55031b347282'})
        await newCat.save()
        
        })

        afterEach(async function(){
            const awaited= await Category.findById({_id:'5c0f66b979af55031b347843'})
                if(awaited){
                    await Category.deleteOne({_id:'5c0f66b979af55031b347843'})

                }
                

                const awaited2= await Category.findById({_id:'5c0f66b979af55031b344862'})
                if(awaited2){
                    await Category.deleteOne({_id:'5c0f66b979af55031b344862'})

                }
            
            })
        
   
it('should send response 201  when creating new category',function(done){
    const req= {
        body :{category:'testCategory'},
        userId:'5c0f66b979af55031b347282'
    }
    const res ={
        statusCode:500,
        message:null,
        status:function(code){
            this.statusCode=code
            return this
        },
        json:function(data){
            this.message=data.message
        }
    }
    ControllerCategory.createCategory(req,res,()=>{})
    .then(result=>{
       
        expect(res.statusCode).to.be.equal(201)
        expect(result.title).to.be.equal('testCategory')
        done()
    }).catch(done)

 })
it('should send response 409  when creating new category',function(done){
    const req= {
        body :{category:'tester'},
        userId:'5c0f66b979af55031b347282'
    }
    const res ={
        statusCode:500,
        message:null,
        status:function(code){
            this.statusCode=code
            return this
        },
        json:function(data){
            this.message=data.message
        }
    }
    ControllerCategory.createCategory(req,res,()=>{})
    .then(result=>{
            expect(res.message).to.be.equal('this category is already exist')
            expect(res.statusCode).to.be.equal(409)
        
       done() 
    }).catch(done)

})

it('should send response 200 with data if fetch is done',function(done){
    const req= {
       params:{
        categoryid:'5c0f66b979af55031b344862'
       }
    }
    const res ={
        statusCode:500,
        message:null,
        category:null,
        status:function(code){
            this.statusCode=code
            return this
        },
        json:function(data){
            this.message=data.message
            this.category=data.category
        }
    }
    ControllerCategory.fetchCategory(req,res,()=>{})
    .then(result=>{
       // console.log(res)
            expect(res.message).to.be.equal('category fetched')
            expect(res.statusCode).to.be.equal(200)
            expect(res.category).not.to.be.null
       done() 
    }).catch(done)

})

it('should fetch all categories with 200 status Code',function(done){
    const req={
        query:{
            page:1
        }
    }
const res={
    statusCode:500,
    categories:null,
    catCount:null,
    status:function(code){
        this.statusCode=code
        return this
    },
    json:function(data){
        this.categories=data.categories,
        this.catCount=data.countcategories
    }
}


ControllerCategory.fetchCategories(req,res,()=>{}).then(result=>{
    //console.log(res.categories)
    expect(res.catCount).to.be.equal(3)
    expect(res.categories).to.be.an('array')
    expect(res.statusCode).to.be.equal(200)
    done()
}).catch(done)




})

it('should send response 200 when we delete',function(done){
    const req= {
       params:{
        categoryid:'5c0f66b979af55031b347843'
       }
       ,userId:'5c0f66b979af55031b347282'
    }
    const res ={
        statusCode:500,
        awaiteddelete:null,
        status:function(code){
            this.statusCode=code
            return this
        },
        json:function(data){
            this.awaiteddelete=data.awaiteddelete
        }
    }
    ControllerCategory.deleteCategory(req,res,()=>{})
    .then(result=>{
        
           expect(res.statusCode).to.be.equal(200)
           expect(res.awaiteddelete).not.to.be.null
       done() 
    }).catch(done)

})


it('should send response 200 when we edit',function(done){
    const req= {
       params:{
        categoryid:'5c0f66b979af55031b347843'
       }
       ,userId:'5c0f66b979af55031b347282',
      body:{ category:'newCategoryToAdd'
    }}
    const res ={
        statusCode:500,
        category:null,
        status:function(code){
            this.statusCode=code
            return this
        },
        json:function(data){
            this.category=data.category
        }
    }
    ControllerCategory.editCategory(req,res,()=>{})
    .then(()=>{
        expect(res.category.title).to.be.equal(req.body.category)
        expect(res.statusCode).to.be.equal(201)
       done() 
    }).catch(done)

})














    after(function (done) {
        User.deleteMany({})
        .then(() => {
                 return Category.deleteMany({}) })
            .then(() => {
                return mongoose.disconnect();

            }).then(() => { done(); })
    });




})