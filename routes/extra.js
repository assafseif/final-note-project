import { Router } from 'express'
import * as ExtraController from '../controllers/extra.js'

const router = Router()

router.get('/popular',ExtraController.Popular)

export default router;