// import pkg from 'chai';
// import Category from '../models/category.js'
// import User from '../models/user.js'
// import Hashtag from '../models/hashtag.js'
// import Note from '../models/note.js'
// import * as ControllerNote from '../controllers/note.js'

// const { expect} = pkg;
// import chaiuse from 'chai-as-promised'
// pkg.use(chaiuse)
// import mongoose from 'mongoose'
// import sinon from 'sinon'



// describe('Auth Controller', function () {
//     before(function (done) {
//         mongoose.connect('mongodb://localhost:27017/test2')
//             .then(result => {
//                 const user = new User({
//                     email: 'test@test.com',
//                     name: 'Test',
//                     password: '$2a$12$xP8Y3beksZUpdQwcs12MEufvYexm7dmykrBOj8bTMsXEkc7Hfaiti',
//                     posts: [],
//                     _id: '5c0f66b979af55031b347282',
//                     emailVerified: false,
//                     userTokenExpires: Date.now() + 3600000,
//                     wrongPassword: {
//                         Attempt: 3,
//                         Forbidden: false,
//                         ForbiddenTime: 0
//                     },
//                     IpAddress: {
//                         Ip: ["0.0.0.0"],
//                         IpToken: '',
//                         IpTokenExpires: 0,

//                     }
//                     ,
//                     notes: []
//                     ,
//                     userToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzc2FmX3NlaWZAb3V0bG9vay5jb20iLCJ1c2VySWQiOiI2MmM5YTc1OTBlMTZjODBjZjhjZjhiMDYiLCJpYXQiOjE2NTczODUwNTgsImV4cCI6MTY1NzM4ODY1OH0.2Cj9UBoF_Pt0-9Nt5u4KAlIN5bxHlIoIDipeCrQdpBo'
//                 });
//                 return user.save();
//             })
//             .then(result => {
//                 const note = new Note({
//                     _id: '5c0f66b979af55031b347273',
//                     title: 'testerr',
//                     description: 'i like testing',
//                     creator: '5c0f66b979af55031b347282',
//                     category: '5c0f66b979af55031b347456',
//                     hashtags: []

//                 })


//                 return note.save()
//             })
//             .then(result => {
//                 done()
//             }).catch(err => console.log(err))
//     })
//     it('should send response 200 if note created', function (done) {             //createNote
//         const req = {

//             body: {
//                 tags: 'testtag', category: 'testcategory', description: 'i like testing', title: 'testing test'
//             }
//             , userId: '5c0f66b979af55031b347282'

//         }

//         const res={
//             statusCode:500,
//             message:null,
//             note:null    
//             ,
//             status:function(code){
//                 this.statusCode=code
//                 return this
//             },
//             json:function(data){
//                 this.message=data.message
//                 this.note=data.note
//             }
//         }

//             ControllerNote.createNote(req,res,()=>{})
//             .then(result=>{
//                  //console.log(res)
//                 expect(res.statusCode).to.be.equal(201)
//                 expect(res.message).to.be.equal('done')
//                 expect(res.note.hashtags).to.have.lengthOf(1)
//                 expect(res.note.category).to.not.be.null
//                 done()
//             }).catch(done)








//     })

//     // it('should send response 404 if there is no user',async  ()=> {
//     //     const req = {
//     //         userId: '5c0f66b979af55031b347282'
//     //     };

//     //     try {
//     //         await expect(ControllerNote.createNote.bind(this,req,{},()=>{})).to.be.rejectedWith(Error)

//     //     } catch (err) { console.log(err) }

//     // });

//     it('should send response 200 when fetching a note ',function(done){              //fetchNote

//      const req = {

//                 params: {
//                     noteId:'5c0f66b979af55031b347273'
//                 }
//                 , userId: '5c0f66b979af55031b347282'

//             }



//             const res={
//                 statusCode:500,
//                 message:null,
//                 status:function(code){
//                     this.statusCode=code
//                     return this
//                 },
//                 json:function(data){
//                     this.message=data.message
//                 }
//             }
//             ControllerNote.getNote(req,res,()=>{})
//                 .then(result=>{
//                     console.log(res)
//                     expect(res.statusCode).to.be.equal(200)
//                     done()
//                 }).catch(done)








//     })





//     after(function (done) {
//         Note.deleteMany({}).then(() => {
//             return User.deleteMany({})
//         })
//             .then(() => {

//                 return Hashtag.deleteMany({})

//             }).then(() => { return Category.deleteMany({}) })
//             .then(() => {
//                 return mongoose.disconnect();

//             }).then(() => { done(); })
//     });




// })