import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Statistics from './Statistics'; // Importing the Statistics component
import Contributions from './Contributions'; // Importing the Contributions component

const UserProfile = () => {
  const { user_id } = useParams(); // Get the user ID from the URL
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user_id) {
      setError('User ID is not provided');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/user/profile/${user_id}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token if required
          },
        });
        if (!response.ok) throw new Error('Profile not found');
        const data = await response.json();
        console.log(data);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, [user_id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  // Handle input changes for the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/user/profile/${user_id}/`, {
        method: 'PATCH', // Use PATCH for partial updates
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token if required
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: profile.username,
          bio: profile.bio,
          location: profile.location,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const updatedData = await response.json();
      setProfile(updatedData);
      setIsEditing(false); // Exit edit mode after successful update
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-900 text-white p-4">
      {/* Left Side Profile Info */}
      <div className="w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="text-center mt-4">
          <h3 className="text-xl font-semibold mb-2">Username</h3>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              className="text-3xl font-semibold bg-gray-700 text-white p-2 rounded-xl mb-2 w-full"
              placeholder="Enter your name"
            />
          ) : (
            <h2 className="text-3xl font-semibold">{profile.username}</h2>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Bio</h3>
          {isEditing ? (
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
              className="bg-gray-700 text-gray-300 p-2 rounded-xl w-full h-24"
              placeholder="Tell us about yourself"
            />
          ) : (
            <p className="text-gray-300">{profile.bio}</p>
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Location</h3>
          {isEditing ? (
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleInputChange}
              className="bg-gray-700 text-gray-300 p-2 rounded-xl w-full"
              placeholder="Enter your location"
            />
          ) : (
            <p className="text-gray-300">{profile.location}</p>
          )}
        </div>

        {isEditing ? (
          <div className="flex space-x-4 mt-6">
            <button
              className="bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-rose-700 transition-all duration-300"
              onClick={handleProfileUpdate} // Save the changes by updating the backend
            >
              Save
            </button>
            <button
              className="bg-gray-600 text-white py-2 px-4 rounded-xl hover:bg-gray-700 transition-all duration-300"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-rose-700 transition-all duration-300 mt-6"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Right Side for Statistics and Contributions */}
      <div className="w-2/3 flex flex-col space-y-4 pl-6">
        {/* Upper half for Statistics */}
        <div className="h-1/2 bg-zinc-800 p-6 rounded-lg shadow-lg">
          <Statistics userId={user_id} />
        </div>

        {/* Lower half for Contributions */}
        <div className="flex justify-center items-center h-1/2 bg-zinc-800 p-6 rounded-lg shadow-lg">
          <Contributions userId={user_id} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
