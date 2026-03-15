import React, { useState, useEffect } from 'react';
import { updateUserProfile, getUserData } from '../services/authService';

const Settings = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const currentUser = getUserData();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleUpdateProfile = () => {
    if (updateUserProfile({ name: user.name })) {
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({...user, name: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p className="mt-1 text-lg">{user.name || 'John Doe'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-600">{user.email || 'chaukelavani@gmail.com'}</p>
          </div>
          
          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;