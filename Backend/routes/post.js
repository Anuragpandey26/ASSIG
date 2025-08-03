import express from 'express';
import { createPost, getHomeFeed, getUserPosts } from '../controllers/postController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/posts', authMiddleware, createPost);
router.get('/feed', authMiddleware, getHomeFeed);
router.get('/users/:userId/posts', getUserPosts); 

export default router;