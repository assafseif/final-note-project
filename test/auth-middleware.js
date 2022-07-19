// import authMiddleware from '../middleware/is-auth.js'

// import pkg from 'chai';
// const {expect} = pkg;

// import jwt from 'jsonwebtoken'

// import sinon from 'sinon'

// describe('Authentication', function () {
//     it('should throw an error if no authoruzation header is present', function () {
//         const req = {
//             get: function () {
//                 return null;
//             }
//         }

//         expect(authMiddleware.bind(this, req, {}, () => { })).to.throw('Not authenticated')

//     });


//     it('should throw error if the authorization is one string', function () {
//         const req = {
//             get: function () {
//                 return 'xyxyz'

//             }
//         }
//         expect(authMiddleware.bind(this, req, {}, () => { })).to.throw()


//     })
//     it('should yield userId after decoding token', function () {
//         const req = {
//             get: function () {
//                 return 'Bearer asdasdadasdasd456'
//             }
//         }
//         sinon.stub(jwt,'verify');
//         jwt.verify.returns({userId:'abc'})
//         authMiddleware(req, {}, () => { });
//         expect(req).to.have.property('userId')
//         expect(jwt.verify.called).to.be.true
//         jwt.verify.restore();   

//     })

//     it('should throw error if token is not verified', function () {
//         const req = {
//             get: function () {
//                 return 'Bearer xyz';
//             }
//         }
//         expect(authMiddleware.bind(this, req, {}, () => { })).to.throw()


//     })


   

// })

