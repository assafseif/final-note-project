import { Router } from "express";
import * as postController from '../controllers/post.js'
import isAuth from '../middleware/is-auth.js'

const router =Router();

router.post('/new-post',isAuth,postController.createpost)
router.delete('/delete-post/:postId',isAuth,postController.deletePost)
router.get('/get-post/:postId',isAuth,postController.getPost)
router.get('/get-posts',isAuth,postController.fetchAll)

export default router;