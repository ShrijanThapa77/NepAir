import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';
import { db } from "../firebase";
import { 
  Search, Users, Crown, CheckCircle, Clock, 
  Trash2, AlertCircle, UserCheck, FileText,
  MessageSquare, Plus, X, Edit, Send, Activity,
  ArrowRight, ChevronRight, User, Settings, LogOut, 
  Home, Sliders
} from 'lucide-react';
import './AdminDash.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [activeSection, setActiveSection] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const [newIssue, setNewIssue] = useState({ title: '', description: '', priority: 'medium' });
  const [showNewIssueForm, setShowNewIssueForm] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueComment, setIssueComment] = useState('');

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

  const fetchIssues = async () => {
    try {
      const issuesCollection = collection(db, 'issues');
      const issuesQuery = query(issuesCollection, orderBy('createdAt', 'desc'));
      const issuesSnapshot = await getDocs(issuesQuery);
      const issuesData = issuesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIssues(issuesData);
    } catch (error) {
      console.error("Error fetching issues:", error);
      showNotification('Error fetching issues!', 'error');
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

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    
    if (!newIssue.title.trim() || !newIssue.description.trim()) {
      showNotification('Please fill all required fields', 'error');
      return;
    }
    
    try {
      const issueData = {
        ...newIssue,
        status: 'open',
        createdAt: serverTimestamp(),
        createdBy: 'Admin User', // Normally would use current user's info
        comments: []
      };
      
      await addDoc(collection(db, 'issues'), issueData);
      showNotification('Issue created successfully!', 'success');
      setNewIssue({ title: '', description: '', priority: 'medium' });
      setShowNewIssueForm(false);
      fetchIssues();
    } catch (error) {
      console.error("Error creating issue:", error);
      showNotification('Error creating issue!', 'error');
    }
  };

  const handleUpdateIssueStatus = async (issueId, newStatus) => {
    try {
      const issueDoc = doc(db, 'issues', issueId);
      await updateDoc(issueDoc, { status: newStatus });
      
      // Update local state
      setIssues(issues.map(issue => 
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      ));
      
      if (selectedIssue?.id === issueId) {
        setSelectedIssue({...selectedIssue, status: newStatus});
      }
      
      showNotification(`Issue ${newStatus}!`, 'success');
    } catch (error) {
      console.error("Error updating issue:", error);
      showNotification('Error updating issue!', 'error');
    }
  };

  const handleAddComment = async () => {
    if (!issueComment.trim() || !selectedIssue) return;
    
    try {
      const issueDoc = doc(db, 'issues', selectedIssue.id);
      
      const newComment = {
        text: issueComment,
        createdAt: new Date().toISOString(),
        createdBy: 'Admin User' // Normally would use current user's info
      };
      
      const updatedComments = [...(selectedIssue.comments || []), newComment];
      
      await updateDoc(issueDoc, { comments: updatedComments });
      
      // Update local state
      setIssues(issues.map(issue => 
        issue.id === selectedIssue.id 
          ? { ...issue, comments: updatedComments } 
          : issue
      ));
      
      setSelectedIssue({...selectedIssue, comments: updatedComments});
      setIssueComment('');
      
      showNotification('Comment added!', 'success');
    } catch (error) {
      console.error("Error adding comment:", error);
      showNotification('Error adding comment!', 'error');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPendingAdmins();
    fetchIssues();
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
      title: "Open Issues", 
      value: issues.filter(issue => issue.status === 'open').length, 
      icon: <AlertCircle size={20} />, 
      color: "#EF4444" 
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
      default: return '';
    }
  };

  const getIssuePriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getIssueStatusClass = (status) => {
    switch (status) {
      case 'open': return 'status-pending';
      case 'in-progress': return 'status-in-progress';
      case 'closed': return 'status-approved';
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
          <button 
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('users');
              setActiveTab('users');
            }}
          >
            <Users size={18} />
            <span>Users</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'issues' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('issues');
              setActiveTab('issues-list');
            }}
          >
            <AlertCircle size={18} />
            <span>Issues</span>
          </button>
          <div className="nav-divider"></div>
        </nav>
      </div>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            {activeSection === 'users' && (
              <>
                <h1>User Management</h1>
                <p>Manage system users and admin approvals</p>
              </>
            )}
            {activeSection === 'issues' && (
              <>
                <h1>Issue Tracking</h1>
                <p>Manage and track system issues and tasks</p>
              </>
            )}
          </div>
          <div className="user-profile">
            <div className="profile-avatar">A</div>
            <div className="profile-info">
              <p className="profile-name">Admin User</p>
            </div>
          </div>
        </header>

        {/* STATS SECTION */}
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

        {/* USERS SECTION */}
        {activeSection === 'users' && (
          <>
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
          </>
        )}

        {/* ISSUES SECTION */}
        {activeSection === 'issues' && (
          <>
            <div className="content-tabs">
              <button 
                className={`tab-button ${activeTab === 'issues-list' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('issues-list');
                  setSelectedIssue(null);
                }}
              >
                <AlertCircle size={16} />
                <span>All Issues</span>
              </button>
              {selectedIssue && (
                <button className="tab-button active">
                  <FileText size={16} />
                  <span>Issue Details</span>
                </button>
              )}
            </div>

            <div className="content-container">
              {activeTab === 'issues-list' && !selectedIssue && (
                <div className="data-container">
                  <div className="table-controls">
                    <div className="search-box">
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search issues..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button 
                      className="new-button"
                      onClick={() => setShowNewIssueForm(true)}
                    >
                      <Plus size={16} />
                      <span>New Issue</span>
                    </button>
                  </div>

                  {issues.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <AlertCircle size={48} />
                      </div>
                      <h3>No Issues Found</h3>
                      <p>There are no issues in the system at this time.</p>
                      <button 
                        className="action-button"
                        onClick={() => setShowNewIssueForm(true)}
                      >
                        <Plus size={16} />
                        <span>Create New Issue</span>
                      </button>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {issues
                            .filter(issue => issue.title.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(issue => (
                              <tr key={issue.id}>
                                <td>
                                  <div className="issue-title">
                                    <span>{issue.title}</span>
                                  </div>
                                </td>
                                <td>
                                  <span className={`badge ${getIssuePriorityClass(issue.priority)}`}>
                                    {issue.priority}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${getIssueStatusClass(issue.status)}`}>
                                    {issue.status}
                                  </span>
                                </td>
                                <td>
                                  {new Date(issue.createdAt?.toDate() || new Date()).toLocaleDateString()}
                                </td>
                                <td>
                                  <button 
                                    className="action-button view"
                                    onClick={() => setSelectedIssue(issue)}
                                  >
                                    <ArrowRight size={16} />
                                    <span>View</span>
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

              {selectedIssue && (
                <div className="issue-detail-container">
                  <div className="issue-header">
                    <div className="issue-title-section">
                      <h2>{selectedIssue.title}</h2>
                      <div className="issue-badges">
                        <span className={`badge ${getIssuePriorityClass(selectedIssue.priority)}`}>
                          {selectedIssue.priority}
                        </span>
                        <span className={`badge ${getIssueStatusClass(selectedIssue.status)}`}>
                          {selectedIssue.status}
                        </span>
                      </div>
                    </div>
                    <div className="issue-actions">
                      {selectedIssue.status === 'open' && (
                        <button 
                          className="action-button approve"
                          onClick={() => handleUpdateIssueStatus(selectedIssue.id, 'in-progress')}
                        >
                          <Clock size={16} />
                          <span>Start Progress</span>
                        </button>
                      )}
                      {selectedIssue.status === 'in-progress' && (
                        <button 
                          className="action-button approve"
                          onClick={() => handleUpdateIssueStatus(selectedIssue.id, 'closed')}
                        >
                          <CheckCircle size={16} />
                          <span>Close Issue</span>
                        </button>
                      )}
                      <button 
                        className="action-button secondary"
                        onClick={() => setSelectedIssue(null)}
                      >
                        <X size={16} />
                        <span>Close</span>
                      </button>
                    </div>
                  </div>

                  <div className="issue-content">
                    <div className="issue-details">
                      <div className="detail-section">
                        <h3>Description</h3>
                        <p>{selectedIssue.description}</p>
                      </div>

                      <div className="detail-section">
                        <h3>Comments</h3>
                        <div className="comments-container">
                          {(selectedIssue.comments?.length || 0) === 0 ? (
                            <p className="no-comments">No comments yet</p>
                          ) : (
                            <div className="comments-list">
                              {selectedIssue.comments?.map((comment, index) => (
                                <div className="comment-item" key={index}>
                                  <div className="comment-header">
                                    <div className="user-avatar small">{comment.createdBy.charAt(0)}</div>
                                    <span className="comment-author">{comment.createdBy}</span>
                                    <span className="comment-date">
                                      {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="comment-body">
                                    <p>{comment.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="comment-form">
                            <div className="form-input">
                              <textarea
                                placeholder="Add a comment..."
                                value={issueComment}
                                onChange={(e) => setIssueComment(e.target.value)}
                              ></textarea>
                            </div>
                            <div className="form-actions">
                              <button 
                                className="action-button"
                                onClick={handleAddComment}
                                disabled={!issueComment.trim()}
                              >
                                <Send size={16} />
                                <span>Add Comment</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="issue-sidebar">
                      <div className="sidebar-section">
                        <h4>Details</h4>
                        <div className="detail-item">
                          <span className="detail-label">Created by</span>
                          <span className="detail-value">{selectedIssue.createdBy}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Created on</span>
                          <span className="detail-value">
                            {new Date(selectedIssue.createdAt?.toDate() || new Date()).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Status</span>
                          <span className={`detail-value status ${selectedIssue.status}`}>
                            {selectedIssue.status}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Priority</span>
                          <span className={`detail-value priority ${selectedIssue.priority}`}>
                            {selectedIssue.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* NEW ISSUE FORM MODAL */}
      {showNewIssueForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Create New Issue</h2>
              <button className="close-button" onClick={() => setShowNewIssueForm(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateIssue}>
                <div className="form-group">
                  <label htmlFor="issue-title">Title</label>
                  <input
                    id="issue-title"
                    type="text"
                    value={newIssue.title}
                    onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                    placeholder="Issue title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="issue-desc">Description</label>
                  <textarea
                    id="issue-desc"
                    value={newIssue.description}
                    onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                    placeholder="Detailed description of the issue"
                    rows={5}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="issue-priority">Priority</label>
                  <select
                    id="issue-priority"
                    value={newIssue.priority}
                    onChange={(e) => setNewIssue({...newIssue, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="action-button secondary"
                    onClick={() => setShowNewIssueForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="action-button"
                  >
                    Create Issue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {showConfirmModal && userToRemove && (
        <div className="modal-backdrop">
          <div className="modal confirm-modal">
            <div className="modal-header">
              <h2>Confirm User Removal</h2>
              <button className="close-button" onClick={() => setShowConfirmModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to remove the user <strong>{userToRemove.firstName} {userToRemove.lastName}</strong>?</p>
              <p className="warning-text">This action cannot be undone.</p>
              <div className="form-actions">
                <button 
                  className="action-button secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="action-button delete"
                  onClick={handleRemoveUser}
                >
                  Confirm Removal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Admin Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;