import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Post text is required'],
        trim: true,
        maxlength: [500, 'Post text cannot exceed 500 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', postSchema);
export default Post;