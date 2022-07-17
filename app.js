import express from 'express'
import authRoutes from './routes/auth.js'
import bodyParser from 'body-parser';
import mongoose from 'mongoose'
import compression  from 'compression';
import postRoutes from './routes/post.js'
import multer from 'multer';
import cors from 'cors'

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const APP_PORT =process.env.PORT || 8080 ;
console.log(process.env.MONGO_PASSWORD,process.env.MONGO_USER,process.env.EMAIL,process.env.EMAIL_PASSWORD)

const app = express()
app.use(compression())
app.use(bodyParser.json())



app.use(cors())
app.use('/images', express.static(path.join(__dirname, 'images')))
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }

 
})



app.use(multer({ storage: fileStorage }).single('image'))

app.use('/post',postRoutes)
app.use('/auth',authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.gglhiyb.mongodb.net/?retryWrites=true&w=majority`).then((client)=>{

app.listen( APP_PORT || 8080 ,()=>{
    console.log(`you joined host ${APP_PORT}`)
})

}).catch(err=>console.log(err))

