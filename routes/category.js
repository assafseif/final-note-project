import { Router } from "express";
import * as categoryController from '../controllers/category.js'
import isAuth from '../middleware/is-auth.js'
import pkg from 'express-validator'
const { body } = pkg

const router = Router();
router.get('/get-categories',isAuth,categoryController.fetchCategories)

export default router;