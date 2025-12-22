import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { issueAPI, userAPI, statsAPI } from '../utils/api';
import { FaUsers, FaExclamationTriangle, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [issues, setIssues] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsRes, issuesRes, staffRes] = await Promise.all([
                statsAPI.getDashboardStats(),
                issueAPI.getAllIssues(),
                user.role === 'admin' ? userAPI.getAllUsers({ role: 'staff' }) : Promise.resolve({ data: { users: [] } })
            ]);

            setStats(statsRes.data);
            setIssues(issuesRes.data.issues);
            setStaff(staffRes.data.users || []);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignIssue = async (issueId, staffId) => {
        try {
            await issueAPI.assignIssue(issueId, staffId);
            loadDashboardData();
            alert('Issue assigned successfully!');
        } catch (error) {
            alert('Error assigning issue: ' + error.response?.data?.message);
        }
    };

    const handleUpdateStatus = async (issueId, status) => {
        try {
            await issueAPI.updateStatus(issueId, status, `Status updated to ${status}`);
            loadDashboardData();
            alert('Status updated successfully!');
        } catch (error) {
            alert('Error updating status: ' + error.response?.data?.message);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-page" style={{ padding: '2rem' }}>
            <div className="container">
                <h1>Dashboard</h1>
                <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
                    Welcome back, {user.name}! Here's an overview of all issues.
                </p>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <FaExclamationTriangle style={{ fontSize: '2rem', color: 'var(--warning-500)', marginBottom: '0.5rem' }} />
                            <h3>{stats.issues.total}</h3>
                            <p>Total Issues</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <FaClock style={{ fontSize: '2rem', color: 'var(--primary-500)', marginBottom: '0.5rem' }} />
                            <h3>{stats.issues.pending}</h3>
                            <p>Pending</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <FaClock style={{ fontSize: '2rem', color: 'var(--primary-600)', marginBottom: '0.5rem' }} />
                            <h3>{stats.issues.inProgress}</h3>
                            <p>In Progress</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <FaCheckCircle style={{ fontSize: '2rem', color: 'var(--success-500)', marginBottom: '0.5rem' }} />
                            <h3>{stats.issues.resolved}</h3>
                            <p>Resolved</p>
                        </div>
                    </div>
                )}

                {/* Issues Table */}
                <div className="card">
                    <h2 style={{ marginBottom: '1rem' }}>All Issues</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--gray-200)', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem' }}>Title</th>
                                    <th style={{ padding: '0.75rem' }}>Category</th>
                                    <th style={{ padding: '0.75rem' }}>Citizen</th>
                                    <th style={{ padding: '0.75rem' }}>Status</th>
                                    <th style={{ padding: '0.75rem' }}>Priority</th>
                                    <th style={{ padding: '0.75rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issues.map((issue) => (
                                    <tr key={issue._id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                                        <td style={{ padding: '0.75rem' }}>{issue.title}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <span className="badge badge-normal">{issue.category}</span>
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>{issue.citizenName}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <span className={`badge badge-${issue.status}`}>{issue.status}</span>
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <span className={`badge badge-${issue.priority}`}>{issue.priority}</span>
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {user.role === 'admin' && issue.status === 'pending' && staff.length > 0 && (
                                                    <select
                                                        onChange={(e) => handleAssignIssue(issue._id, e.target.value)}
                                                        style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--gray-300)' }}
                                                    >
                                                        <option value="">Assign to...</option>
                                                        {staff.map((s) => (
                                                            <option key={s._id} value={s._id}>{s.name}</option>
                                                        ))}
                                                    </select>
                                                )}
                                                {(user.role === 'staff' || user.role === 'admin') && issue.status !== 'closed' && (
                                                    <select
                                                        value={issue.status}
                                                        onChange={(e) => handleUpdateStatus(issue._id, e.target.value)}
                                                        style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--gray-300)' }}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="assigned">Assigned</option>
                                                        <option value="in-progress">In Progress</option>
                                                        <option value="resolved">Resolved</option>
                                                        <option value="closed">Closed</option>
                                                    </select>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
