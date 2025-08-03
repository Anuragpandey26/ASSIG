import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/users/logout', {}, { withCredentials: true });
      navigate('/login'); // Redirect to login only after successful logout
    } catch (error) {
      console.error('Error logging out:', error);
      // Optionally, stay on the current page or show an error message
    }
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <div className="text-xl font-bold">Mini LinkedIn</div>
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <span className="text-sm">Welcome, {user.name}</span>
            <img
              src={user.profilePic || 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'}
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={() => navigate('/profile')}
            />
          </>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;