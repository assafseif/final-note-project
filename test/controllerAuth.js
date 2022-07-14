import pkg from 'chai';
const { expect } = pkg;
import mongoose from 'mongoose'
import sinon from 'sinon'
import jwt from 'jsonwebtoken'

import User from '../models/user.js'
import * as AuthController from '../controllers/auth.js'

describe('Auth Controller', function () {
  before(function (done) {
    
    mongoose
      .connect(
        'mongodb://localhost:27017'
      )
      .then(result => {
        const user = new User({
          email: 'test@test.com',
          name: 'Test',
          password: '$2a$12$xP8Y3beksZUpdQwcs12MEufvYexm7dmykrBOj8bTMsXEkc7Hfaiti',
          posts: [],
          _id: '5c0f66b979af55031b347282',
          emailVerified: false,
          userTokenExpires: Date.now() + 3600000,
          userToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzc2FmX3NlaWZAb3V0bG9vay5jb20iLCJ1c2VySWQiOiI2MmM5YTc1OTBlMTZjODBjZjhjZjhiMDYiLCJpYXQiOjE2NTczODUwNTgsImV4cCI6MTY1NzM4ODY1OH0.2Cj9UBoF_Pt0-9Nt5u4KAlIN5bxHlIoIDipeCrQdpBo'
        });
        return user.save();
      })
      .then((result) => {
        //console.log(result)
        done();
      });
  });


  // it('should throw an error with code 500 if accessing the database fails', function (done) {
  //   sinon.stub(User, 'findOne');
  //   User.findOne.throws();

  //   const req = {
  //     body: {
  //       email: 'test@test.com',
  //       password: 'tester'
  //     }
  //   };

  //   AuthController.login(req, {}, () => { }).then(result => {
     
  //     expect(result).to.be.an('error');
  //     expect(result).to.have.property('statusCode', 500);
     
  //     done()
  //   }).catch(done);

  //   User.findOne.restore();
  // });
  // it('should send a response with valid in login', function (done) {

  //   const req = {
  //     body: {
  //       email: 'test@test.com',
  //       password: 'tester'
  //     }
  //   }
  //   const res = {
  //     statusCode: 500,
  //     token: null,
  //     status: function (code) {
  //       this.statusCode = code;
  //       return this;
  //     },

  //     json: function (data) {
  //       this.token = data.token

  //     }
  //   }
  //   sinon.stub(jwt, 'sign')
  //   let data;
  //   jwt.sign.returns('454asd5a4sd87asd45a4sd4a5s6d')
  //   AuthController.login(req, res, () => { })
  //     .then(result => {
  //       data=result.toJSON();
  //       expect(res.statusCode).to.be.equal(200)
  //       expect(res.token).not.be.equal(null)
  //       expect(data).to.have.property('_id')
  //       done()
  //     }).catch(done);
  //   jwt.sign.restore()





  // })

  it('should response a 200 if the email get verified', function (done) {
    const req = {
      params: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzc2FmX3NlaWZAb3V0bG9vay5jb20iLCJ1c2VySWQiOiI2MmM5YTc1OTBlMTZjODBjZjhjZjhiMDYiLCJpYXQiOjE2NTczODUwNTgsImV4cCI6MTY1NzM4ODY1OH0.2Cj9UBoF_Pt0-9Nt5u4KAlIN5bxHlIoIDipeCrQdpBo'

      }
    }
    const res = {
      statusCode: 500,
      message: null,
      status: function (code) {
        this.statusCode = code
        return this
      },
      json: function (data) {
        this.message = data.message
      }
    }

let data;
    AuthController.getVerified(req, res, () => { })
      .then((user) => {console.log(user)
        data =user.toJSON()
        expect(res.statusCode).to.be.equal(200);
        expect(data.emailVerified).to.be.equal(false)
        done()
      }).catch(done);




  })

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
