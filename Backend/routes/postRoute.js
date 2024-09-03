import express from 'express';
import isAuthentication from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { addComment, addNewPost, bookmarkPost,deletePost, dislikePost,getAllPost,getCommentsOfPost,getUserPost,likePost } from '../controllers/postControllers.js';

const router = express.Router();

// User registration route
router.route('/addpost').post(isAuthentication, upload.single('image'), addNewPost);
router.route('/all').get(isAuthentication, getAllPost);
router.route('/userpost/all').get(isAuthentication, getUserPost);
router.route('/:id/like').get(isAuthentication, likePost);
router.route('/:id/dislike').post(isAuthentication, dislikePost);
router.route('/:id/comment').post(isAuthentication, addComment);

router.route('/:id/comment/all').post(isAuthentication, getCommentsOfPost);
router.route('/delete/:id').post(isAuthentication, deletePost);
router.route('/:id/bookmark').post(isAuthentication, bookmarkPost);

export default router;
