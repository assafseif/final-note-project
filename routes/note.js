import { Router } from "express";
import * as noteController from '../controllers/note.js'
import isAuth from '../middleware/is-auth.js'
import pkg from 'express-validator'
const { body } = pkg

const router = Router();

router.post('/create-note',[
     body('title')
    .isLength({min : 5 , max:15}).withMessage('enter a valid title between this Range 5--->15 ')
    ,

    body('description')
    .isLength({min : 5 , max:55}).withMessage('enter a valid category betweene this Range 5--->55 '),
    
    body('category')
    .isLength({min :5}).withMessage('enter a valid category betweene this Range 5--->15 ')
    

],isAuth,noteController.createNote)

router.get('/get-note/:noteId',isAuth,noteController.getNote);

router.put('/edit-note/:noteId',[
   
    body('title')
    .isLength({min : 5 , max:15}).withMessage('enter a valid title between this Range 5--->15 ')
    ,

    body('description')
    .isLength({min : 5 , max:55}).withMessage('enter a valid category betweene this Range 5--->55 '),

    body('category')
    .isLength({min :5}).withMessage('enter a valid category betweene this Range 5--->15 ')
    
],isAuth,noteController.editNote)

router.delete('/delete-note/:noteId',isAuth,noteController.deleteNote)
router.get('/get-notes',isAuth,noteController.fetchAll)
//router.get('/get-Notes-tags/:tagId',isAuth,noteController.fetchByTags)
export default router;