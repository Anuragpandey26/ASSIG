import Post from '../models/post.js';
import User from '../models/user.js';

export const createPost = async (req, res) => {
    try {
        console.log('Creating post for user:', req.user._id);
        const { text } = req.body;

        if (!text) {
            console.log('Validation error: Text is required');
            return res.status(400).json({ message: 'Post text is required' });
        }

        const post = new Post({
            text,
            author: req.user._id
        });
        await post.save();
        console.log('Post created successfully:', post._id);
        res.status(201).json({
            message: 'Post created successfully',
            post: {
                id: post._id,
                text: post.text,
                author: req.user.name,
                createdAt: post.createdAt
            }
        });
    } catch (error) {
        console.error('Error in createPost:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getHomeFeed = async (req, res) => {
    try {
        console.log('Fetching home feed for user:', req.user._id);
        const posts = await Post.find().populate('author', 'name').sort({ createdAt: -1 });
        console.log('Home feed fetched, posts count:', posts.length);
        res.status(200).json({
            message: 'Home feed retrieved successfully',
            posts: posts.map(post => ({
                id: post._id,
                text: post.text,
                author: post.author.name,
                createdAt: post.createdAt
            }))
        });
    } catch (error) {
        console.error('Error in getHomeFeed:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        console.log('Fetching posts for user:', req.params.userId);
        const user = await User.findById(req.params.userId);
        if (!user) {
            console.log('User not found:', req.params.userId);
            return res.status(404).json({ message: 'User not found' });
        }

        const posts = await Post.find({ author: req.params.userId }).populate('author', 'name').sort({ createdAt: -1 });
        console.log('User posts fetched, count:', posts.length);
        res.status(200).json({
            message: 'User posts retrieved successfully',
            posts: posts.map(post => ({
                id: post._id,
                text: post.text,
                author: user.name,
                createdAt: post.createdAt
            }))
        });
    } catch (error) {
        console.error('Error in getUserPosts:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};