import { Router } from 'express'
import { googleLogin } from '../controllers/googleAuth.controller.js'


const router = Router()


router.get('/google', googleLogin)

export default router