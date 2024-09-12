import express from 'express';
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, register, login, logout } from '../controllers/userController.js'; // Ensure login and logout are imported
import isAuthentication from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

// User registration route
router.route('/register').post(register);

// User login route
router.route('/login').post(login);

// User logout route
router.route('/logout').post(logout);

// Get user profile by ID
router.route('/:id/profile').get(isAuthentication, getProfile);

// Edit user profile with profile picture upload
router.route('/profile/edit').post(isAuthentication, upload.single('profilePhoto'), editProfile);

// Get suggested users
router.route('/suggested').get(isAuthentication, getSuggestedUsers);

// Follow or unfollow a user by ID
router.route('/followorunfollow/:id').post(isAuthentication, followOrUnfollow);

export default router;
