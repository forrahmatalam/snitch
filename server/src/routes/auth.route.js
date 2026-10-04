import { Router } from 'express';
import { registerValidator ,loginValidator} from '../validators/auth.validator.js';
import { register ,login, refreshToken, getMe} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';





const router = Router();

  // Register route
router.post('/register', registerValidator, register);

  // Login route
router.post('/login', loginValidator, login);

// Refresh token route
router.post('/refresh', refreshToken);

//get all 
router.get("/me", authenticate, getMe);

export default router;
