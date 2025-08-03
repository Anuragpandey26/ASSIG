import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Landing = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users/me', { withCredentials: true });
        setUser(response.data);
        const feedResponse = await axios.get('http://localhost:3000/api/feed', { withCredentials: true });
        setPosts(feedResponse.data.posts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    try {
      const response = await axios.post('http://localhost:3000/api/posts', { text: newPostText }, { withCredentials: true });
      setPosts([response.data.post, ...posts]); // Add new post to the top
      setNewPostText(''); // Clear the input
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div>
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto mt-6 p-4">
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
        <h2 className="text-xl font-bold mb-4">Home Feed</h2>
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
  );
};

export default Landing;