import { validationResult } from 'express-validator'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
let URL = 'http://localhost:8080';
if (process.env.PORT) {
  URL = 'https://final-for-eurisko.herokuapp.com';
}

//  import nodemailer from 'nodemailer'
//  import transporter from '../util/nodemailer.js'

import User from '../models/user.js'

export const signup = async (req, res, next) => {
  console.log('hone')
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const token = crypto.randomBytes(32).toString('hex')
  console.log(token)
  try {
    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      password: hashedPw,
      name: name,
      userToken: token,
      userTokenExpires: Date.now() + 3600000,
      wrongPassword: {
        Attempt: 0,
        Forbidden: false,
        ForbiddenTime: 0
      }
    });
    const result = await user.save();
    const sendedemail = await transporter.sendMail({
      from: '"Assaf seif expert 👻" <assaf_Seif@outlook.com>', // sender address
      to: email, // list of receivers
      subject: "Hello to assaf  ✔", // Subject line
      text: "welcome for submitting", // plain text body
      html: `
  <h2>Thanks for signing up with Assaf !
  You must follow this link within 1 hour of registration to activate your account:</h2>
    <a href="${URL}/auth/reset/${token}">Click Here</a>
    <h3>Have fun, and don't hesitate to contact us with your feedback.<h3>
  
       <a href="http://localhost:8080/about">The Assaf Team!</a>`,
    });

    if (sendedemail) {
      console.log('email has beed send')
    }

    res.status(201).json({
      message: 'User created!',
      message: 'email sended',
      user: user
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    if (user.emailVerified) {
      const error = new Error('Not authorized please verify your email first');
      error.statusCode = 401;
      throw error;
    }
    if (user.wrongPassword.Forbidden) {

      const error = new Error(`you are forbidden and you still have ${new Date(user.wrongPassword.ForbiddenTime.getTime() + 30 * 60000)}`)
      error.statusCode = 403;
      throw error;
    }

    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      //const error = new Error('Wrong password!');
      user.wrongPassword.Attempt = user.wrongPassword.Attempt + 1;
      console.log(user.wrongPassword.Attempt)
      if (user.wrongPassword.Attempt === 3) {
        user.wrongPassword.Forbidden = true;
        user.wrongPassword.ForbiddenTime = Date.now() + 900000;
        console.log(user.wrongPassword)
        
      await user.save();
        const error = new Error(`you are forbidden for ${user.wrongPassword.ForbiddenTime}  `)
        error.statusCode = 403;
        throw error;

      }
      
      await user.save();
      res.status(401).json({message:"wrong password"})
      // error.statusCode = 401;
      // throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      },
      'secret',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};


export const getVerified = async (req, res, next) => {
  const resetToken = req.params.token;
  //
  try {
    const user = await User.findOne({ userToken: resetToken, userTokenExpires: { $gt: Date.now() } })

    if (!user) {
      const error = new Error('we cant find user with this token')
      error.statusCode = 401;
      throw error;
    }

    user.emailVerified = true;
    const newuser = await user.save()

    res.status(200).json({
      message: "the user is Verified !!!!!",
      user: newuser
    })

    return newuser;
  } catch (err) { console.log(err), next(err) }
}





export const getResetpassword = async (req, res, next) => {
  const email = req.body.email;


  try {
    const user = await User.findOne({ email: email })
    const token = crypto.randomBytes(32).toString('hex')
    console.log(token);
    if (!user) {
      const error = new Error('No user found');
      error.statusCode = 404;
      throw error;
    }
    console.log(token)
    user.userToken = token;
    user.userTokenExpires = Date.now() + 3600000;
    const usersaved = await user.save();

    await transporter.sendMail({
      from: '"Assaf seif expert 👻" <assaf_Seif@outlook.com>', // sender address
      to: email, // list of receivers
      subject: "Reset your Password", // Subject line
      text: "Welcome again !", // plain text body
      html: `
            <h2>Someone (hopefully you) has requested a password reset for your  account. Follow the link below to set a new password::</h2>
                <a href="${URL}/auth/reset/password/${token}">Click Here</a>
                <h3>If you don't wish to reset your password, disregard this email and no action will be taken.<h3>
  
                   <a href="${URL}/about">The Assaf Team!</a>`,
    });
    res.status(200).json({
      message: "token sended",
      user: user
    })


  }
  catch (err) {
    next(err)
  }


}




export const postResetpassword = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = new Error('Password validation error ');
    error.statusCode = 422;
    throw error;

  }
  const token = req.params.token;
  const password = req.body.password;
  const user = await User.findOne({ userToken: token, userTokenExpires: { $gt: Date.now() } })

  if (!user) {
    const error = new Error('no user');
    error.statusCode = 404;
    throw error;
  }
  console.log(password);

  const hashedpassword = await bcrypt.hash(password, 12)

  user.password = hashedpassword;
  const usersaved = await user.save();

  res.status(201).json({
    message: "user password changed",
    newpassword: usersaved.password
  })



}


