import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from "../firebase";
import './AdminDash.css';
import Navbar from '../components/Navbar';

const AdminDash = () => {
  const [users, setUsers] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const fetchPendingAdmins = async () => {
    try {
      const adminsCollection = collection(db, 'users');
      const adminsSnapshot = await getDocs(adminsCollection);
      const adminsData = adminsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.role === 'admin' && user.status === 'pending');
      setPendingAdmins(adminsData);
    } catch (error) {
      console.error("Error fetching pending admins:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const adminDoc = doc(db, 'users', id);
      await updateDoc(adminDoc, { status: 'approved' });
      setPendingAdmins(pendingAdmins.filter(admin => admin.id !== id));
      // Show notification
      const notification = document.createElement('div');
      notification.className = 'notification success';
      notification.textContent = 'Admin approved successfully!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (error) {
      console.error("Error approving admin:", error);
      const notification = document.createElement('div');
      notification.className = 'notification error';
      notification.textContent = 'Error approving admin!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPendingAdmins();
  }, []);

  const stats = [
    { title: "Total Users", value: users.length, icon: "👥" },
    { title: "Active Users", value: users.filter(u => u.status === 'approved').length, icon: "✅" },
    { title: "Pending Admins", value: pendingAdmins.length, icon: "⏳" },
    { title: "Admins", value: users.filter(u => u.role === 'admin' && u.status === 'approved').length, icon: "👑" }
  ];

  return (
    <div className="admin-container">
      <Navbar />
      <div className="admin-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <h3>{stat.title}</h3>
                <p>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            Pending Admins
          </button>
        </div>

        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="table-container">
                <h2>User Management</h2>
                <div className="table-wrapper">
                  <table className="user-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.firstName} {user.lastName}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${user.status}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>
                            <button className="action-btn edit">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'admins' && (
              <div className="table-container">
                <h2>Admin Approvals</h2>
                {pendingAdmins.length === 0 ? (
                  <div className="empty-state">
                    <p>No pending admin approvals at this time.</p>
                  </div>
                ) : (
                  <div className="table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Request Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingAdmins.map(admin => (
                          <tr key={admin.id}>
                            <td>{admin.firstName} {admin.lastName}</td>
                            <td>{admin.email}</td>
                            <td>{new Date(admin.createdAt?.toDate() || new Date()).toLocaleDateString()}</td>
                            <td>
                              <button 
                                className="approve-btn"
                                onClick={() => handleApprove(admin.id)}
                              >
                                Approve
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDash;