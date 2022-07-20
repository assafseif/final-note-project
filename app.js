import express from 'express'

import bodyParser from 'body-parser';
import mongoose from 'mongoose'
import compression  from 'compression';
import noteRoutes from './routes/note.js'

import authRoutes from './routes/auth.js'
import categoryRoutes from './routes/category.js'
import ExtraRoutes from './routes/extra.js'


import helmet from 'helmet'
import cors from 'cors'


const APP_PORT =process.env.PORT || 8080 ;
console.log(process.env.MONGO_PASSWORD,process.env.MONGO_USER,process.env.EMAIL,process.env.EMAIL_PASSWORD)

const app = express()

app.use(helmet())
app.use(compression())
app.use(bodyParser.json())
app.use(cors())

app.use('/extra',ExtraRoutes)
app.use('/category',categoryRoutes)
app.use('/note',noteRoutes)
app.use('/auth',authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.gglhiyb.mongodb.net/?retryWrites=true&w=majority`)
//mongoose.connect('mongodb://localhost:27017')
.then((client)=>{

app.listen( APP_PORT || 8080 ,()=>{
    console.log(`you joined host ${APP_PORT}`)
})

}).catch(err=>console.log(err))

