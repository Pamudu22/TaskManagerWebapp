import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsermanagerComponent = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });

  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role || 'user',
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${apiBaseUrl}/user/${editingUser._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="bg-dark p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>

      <table className="w-full table-auto text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border-b hover:bg-dark-50">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2 capitalize">{user.role}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => handleView(user)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>
                <button
                  onClick={() => handleEditClick(user)}
                  className="text-yellow-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeactivate(user._id)}
                  className="text-red-600 hover:underline"
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Modal */}
      {selectedUser && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-bold">User Profile</h3>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Role:</strong> {selectedUser.role}</p>
          <button
            onClick={() => setSelectedUser(null)}
            className="mt-2 text-sm text-gray-600 underline"
          >
            Close
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-bold">Edit User</h3>
          <div className="space-y-2">
            <input
              type="text"
              className="border p-2 w-full"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              className="border p-2 w-full"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <select
              className="border p-2 w-full"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Update
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsermanagerComponent;
