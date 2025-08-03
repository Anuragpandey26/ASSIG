import React from 'react';

const ProfileCard = ({ user, onEdit }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <img
        src={user.profilePic || 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'}
        alt="Profile"
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold text-center">{user.name}</h2>
      <p className="text-center text-gray-600">{user.email}</p>
      <p className="text-center mt-2">{user.about || 'No bio yet'}</p>
      <div className="mt-4">
        <p><strong>Headline:</strong> {user.headline || 'Not set'}</p>
        <p><strong>Company:</strong> {user.curr_company || 'Not set'}</p>
        <p><strong>Location:</strong> {user.curr_location || 'Not set'}</p>
        <p><strong>Skills:</strong> {user.skills.length > 0 ? user.skills.join(', ') : 'None'}</p>
      </div>
      <button
        onClick={onEdit}
        className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;