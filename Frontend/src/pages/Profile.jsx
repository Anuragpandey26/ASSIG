import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [newPostText, setNewPostText] = useState('');

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users/me', { withCredentials: true });
        setUser(response.data);
        setEditData(response.data);
        const postsResponse = await axios.get(`http://localhost:3000/api/users/${response.data._id}/posts`, { withCredentials: true });
        setPosts(postsResponse.data.posts);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndPosts();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:3000/api/users/profile', editData, { withCredentials: true });
      setUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    try {
      const response = await axios.post('http://localhost:3000/api/posts', { text: newPostText }, { withCredentials: true });
      setPosts([response.data.post, ...posts]); // Add new post to the top of user posts
      setNewPostText(''); // Clear the input
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!user) return <div className="text-center mt-10">User not found</div>;

  return (
    <div>
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto mt-6 p-4">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={editData.name || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={editData.email || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">About</label>
              <textarea
                name="about"
                value={editData.about || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Headline</label>
              <input
                type="text"
                name="headline"
                value={editData.headline || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                name="curr_company"
                value={editData.curr_company || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="curr_location"
                value={editData.curr_location || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Skills</label>
              <input
                type="text"
                name="skills"
                value={editData.skills ? editData.skills.join(', ') : ''}
                onChange={(e) => setEditData({ ...editData, skills: e.target.value.split(', ') })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., JavaScript, React"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="mt-2 w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </form>
        ) : (
          <ProfileCard user={user} onEdit={handleEdit} />
        )}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Create a Post</h3>
          <form onSubmit={handlePostSubmit} className="mb-6">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-2 border border-gray-300 rounded-md resize-none h-24 focus:ring focus:ring-blue-200"
            />
            <button
              type="submit"
              className="mt-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Post
            </button>
          </form>
          <h3 className="text-xl font-bold mb-4">Your Posts</h3>
          {posts.length === 0 ? (
            <p className="text-center">No posts yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src="https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{post.author}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{post.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;