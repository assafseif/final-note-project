import { Router } from "express";
import * as categoryController from '../controllers/category.js'
import isAuth from '../middleware/is-auth.js'
import pkg from 'express-validator'
const { body } = pkg

const router = Router();
router.get('/get-categories',isAuth,categoryController.fetchCategories)

router.get('/get-category/:categoryid',isAuth,categoryController.fetchCategory)


router.post('/add-category',[ body('category').isLength({ min: 5 })],isAuth,categoryController.createCategory)


router.put('/edit-category/:categoryid',[body('category').isLength({ min: 5 })],isAuth,categoryController.editCategory)


router.delete('/delete-category/:categoryid',isAuth,categoryController.deleteCategory)
export default router;