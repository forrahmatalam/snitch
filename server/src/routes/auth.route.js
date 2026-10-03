import { Router } from 'express';
import { registerValidator ,loginValidator} from '../validators/auth.validator.js';
import { register } from '../controllers/auth.controller.js';




const router = Router();

  // Register route
router.post('/register', registerValidator, register);

  // Login route
router.post('/login', loginValidator, register);

export default router;