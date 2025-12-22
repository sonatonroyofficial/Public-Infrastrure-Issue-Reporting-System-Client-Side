import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { issueAPI, userAPI, statsAPI } from '../utils/api';
import {
    FaUsers,
    FaExclamationTriangle,
    FaCheckCircle,
    FaClock,
    FaTimes,
    FaSearch,
    FaFilter,
    FaChartLine,
    FaClipboardList,
    FaUserTie
} from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [issues, setIssues] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredIssues = issues.filter(issue => {
        const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-72px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, {user.name}! Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={loadDashboardData} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                        Refresh Data
                    </button>
                    {user.role === 'citizen' && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
                            + Report New Issue
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Issues</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.issues.total}</h3>
                        </div>
                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <FaClipboardList className="text-xl" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Pending</p>
                            <h3 className="text-2xl font-bold text-amber-600">{stats.issues.pending}</h3>
                        </div>
                        <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                            <FaClock className="text-xl" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">In Progress</p>
                            <h3 className="text-2xl font-bold text-indigo-600">{stats.issues.inProgress}</h3>
                        </div>
                        <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                            <FaChartLine className="text-xl" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Resolved</p>
                            <h3 className="text-2xl font-bold text-emerald-600">{stats.issues.resolved}</h3>
                        </div>
                        <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <FaCheckCircle className="text-xl" />
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FaExclamationTriangle className="text-gray-400" />
                        Manage Issues
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search issues..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Issue Details</th>
                                <th className="px-6 py-4">Citizen</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Assigned To</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredIssues.length > 0 ? (
                                filteredIssues.map((issue) => (
                                    <tr key={issue._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {issue.photos && issue.photos.length > 0 ? (
                                                    <img src={issue.photos[0]} alt="" className="h-10 w-10 rounded-lg object-cover border border-gray-200" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <FaExclamationTriangle />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900 line-clamp-1">{issue.title}</p>
                                                    <p className="text-xs text-gray-500 capitalize">{issue.category.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{issue.citizenName || 'Anonymous'}</div>
                                            {/* <div className="text-xs text-gray-500">Citizen</div> */}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                                                    issue.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                        issue.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                {issue.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${issue.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                    issue.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-green-100 text-green-800'}`}>
                                                {issue.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {issue.assignedStaffName ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs">
                                                        <FaUserTie />
                                                    </div>
                                                    <span className="text-sm text-gray-700">{issue.assignedStaffName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {user.role === 'admin' && issue.status === 'pending' && (
                                                    <select
                                                        onChange={(e) => handleAssignIssue(issue._id, e.target.value)}
                                                        className="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>Assign...</option>
                                                        {staff.map((s) => (
                                                            <option key={s._id} value={s._id}>{s.name}</option>
                                                        ))}
                                                    </select>
                                                )}

                                                {(user.role === 'staff' || user.role === 'admin') &&
                                                    (user.role === 'admin' || issue.assignedTo === user.id) &&
                                                    issue.status !== 'closed' && (
                                                        <select
                                                            value={issue.status}
                                                            onChange={(e) => handleUpdateStatus(issue._id, e.target.value)}
                                                            className="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="assigned">Assigned</option>
                                                            <option value="in-progress">In Progress</option>
                                                            <option value="resolved">Resolved</option>
                                                            <option value="closed">Closed</option>
                                                        </select>
                                                    )}

                                                <button className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                                                    <FaUsers /> {/* Placeholder for view details */}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colspan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FaClipboardList className="text-4xl text-gray-200 mb-3" />
                                            <p className="font-medium">No issues found</p>
                                            <p className="text-sm">Try adjusting your filters or search terms.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination Placeholder */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <p>Showing {filteredIssues.length} issues</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
