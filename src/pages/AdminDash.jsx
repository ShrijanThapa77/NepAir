import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from "../firebase";
import { 
  Search, Users, Crown, CheckCircle, Clock, 
  Trash2, AlertCircle, UserCheck, FileText
} from 'lucide-react';
import './AdminDash.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);

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
      showNotification('Error fetching users!', 'error');
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
      showNotification('Error fetching pending admins!', 'error');
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleApprove = async (id) => {
    try {
      const adminDoc = doc(db, 'users', id);
      await updateDoc(adminDoc, { status: 'approved' });
      setPendingAdmins(pendingAdmins.filter(admin => admin.id !== id));
      showNotification('Admin approved successfully!', 'success');
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error approving admin:", error);
      showNotification('Error approving admin!', 'error');
    }
  };

  const confirmRemoveUser = (user) => {
    setUserToRemove(user);
    setShowConfirmModal(true);
  };

  const handleRemoveUser = async () => {
    if (!userToRemove) return;
    
    try {
      const userDoc = doc(db, 'users', userToRemove.id);
      await deleteDoc(userDoc);
      setUsers(users.filter(user => user.id !== userToRemove.id));
      showNotification('User removed successfully!', 'success');
      setShowConfirmModal(false);
      setUserToRemove(null);
    } catch (error) {
      console.error("Error removing user:", error);
      showNotification('Error removing user!', 'error');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPendingAdmins();
  }, []);

  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { 
      title: "Total Users", 
      value: users.length, 
      icon: <Users size={20} />, 
      color: "#4F46E5" 
    },
    { 
      title: "Active Users", 
      value: users.filter(u => u.status === 'approved').length, 
      icon: <CheckCircle size={20} />, 
      color: "#10B981" 
    },
    { 
      title: "Pending Admins", 
      value: pendingAdmins.length, 
      icon: <Clock size={20} />, 
      color: "#F59E0B" 
    },
    { 
      title: "Admins", 
      value: users.filter(u => u.role === 'admin' && u.status === 'approved').length, 
      icon: <Crown size={20} />, 
      color: "#8B5CF6" 
    }
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'suspended': return 'status-suspended';
      default: return '';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'user': return 'role-user';
      case 'moderator': return 'role-moderator';
      default: return '';
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Admin Portal</h2>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item active">
            <Users size={18} />
            <span>Users</span>
          </button>
          <button className="nav-item">
            <FileText size={18} />
            <span>Reports</span>
          </button>
          <button className="nav-item">
            <AlertCircle size={18} />
            <span>Issues</span>
          </button>
          <button className="nav-item">
            <UserCheck size={18} />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>User Management</h1>
            <p>Manage system users and admin approvals</p>
          </div>
          <div className="user-profile">
            <div className="profile-avatar">A</div>
            <div className="profile-info">
              <p className="profile-name">Admin User</p>
              <p className="profile-role">Super Admin</p>
            </div>
          </div>
        </header>

        <div className="stats-container">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index} style={{"--card-accent": stat.color}}>
              <div className="stat-icon" style={{backgroundColor: stat.color + "15"}}>
                {stat.icon}
              </div>
              <div className="stat-details">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="content-tabs">
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} />
            <span>All Users</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            <Crown size={16} />
            <span>Pending Admins</span>
            {pendingAdmins.length > 0 && (
              <span className="tab-badge">{pendingAdmins.length}</span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : (
          <div className="content-container">
            {activeTab === 'users' && (
              <div className="data-container">
                <div className="table-controls">
                  <div className="search-box">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="table-container">
                  <table className="data-table">
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
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="empty-table">No users found</td>
                        </tr>
                      ) : (
                        filteredUsers.map(user => (
                          <tr key={user.id}>
                            <td>
                              <div className="user-info">
                                <div className="user-avatar">
                                  {`${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`}
                                </div>
                                <span>{user.firstName} {user.lastName}</span>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                {user.role}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(user.status)}`}>
                                {user.status}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="action-button delete"
                                onClick={() => confirmRemoveUser(user)}
                                aria-label="Remove user"
                              >
                                <Trash2 size={16} />
                                <span>Remove</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'admins' && (
              <div className="data-container">
                {pendingAdmins.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <Clock size={48} />
                    </div>
                    <h3>No Pending Approvals</h3>
                    <p>There are no admin requests waiting for approval at this time.</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Request Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingAdmins.map(admin => (
                          <tr key={admin.id}>
                            <td>
                              <div className="user-info">
                                <div className="user-avatar">
                                  {`${admin.firstName?.charAt(0) || ''}${admin.lastName?.charAt(0) || ''}`}
                                </div>
                                <span>{admin.firstName} {admin.lastName}</span>
                              </div>
                            </td>
                            <td>{admin.email}</td>
                            <td>{new Date(admin.createdAt?.toDate() || new Date()).toLocaleDateString()}</td>
                            <td>
                              <button 
                                className="action-button approve"
                                onClick={() => handleApprove(admin.id)}
                              >
                                <CheckCircle size={16} />
                                <span>Approve</span>
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
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Confirm Removal</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to remove the user <strong>{userToRemove?.firstName} {userToRemove?.lastName}</strong>?</p>
              <p className="modal-warning">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-button cancel"
                onClick={() => {
                  setShowConfirmModal(false);
                  setUserToRemove(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="modal-button confirm"
                onClick={handleRemoveUser}
              >
                Remove User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;