import express from 'express';
import isAuthentication from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { getMessage, sendMessage } from '../controllers/messageController.js';

const router = express.Router();

// User registration route
router.route('/send/:id').post(isAuthentication, sendMessage);

router.route('/all/:id').get(isAuthentication, getMessage);

export default router;