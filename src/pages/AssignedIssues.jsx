import { useState, useEffect } from 'react';
import { issueAPI } from '../utils/api';
import { FaEye, FaSortAmountDown, FaFilter, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AssignedIssues = () => {
    const { user } = useAuth();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        fetchAssignedIssues();
    }, []);

    const fetchAssignedIssues = async () => {
        try {
            // Fetch all issues and filter for assigned on client side or use specific endpoint
            // Since we don't have a specific endpoint yet, we'll fetch all and filter.
            // Ideally backend should support ?assignedTo=me
            const response = await issueAPI.getAllIssues();

            // Filter strictly for this staff member
            const myIssues = response.data.issues.filter(i => i.assignedTo === user.userId);

            // Sort: Boosted/High priority first
            const sorted = myIssues.sort((a, b) => {
                // Boost override
                if (a.isBoosted && !b.isBoosted) return -1;
                if (!a.isBoosted && b.isBoosted) return 1;

                // Priority Check
                const priorityWeight = { high: 3, medium: 2, low: 1 };
                return priorityWeight[b.priority] - priorityWeight[a.priority];
            });

            setIssues(sorted);
        } catch (error) {
            console.error('Error fetching assigned issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (issueId, newStatus) => {
        setUpdating(issueId);
        try {
            await issueAPI.updateStatus(issueId, newStatus, `Status updated to ${newStatus}`);
            // Update local state
            setIssues(issues.map(i =>
                i._id === issueId ? { ...i, status: newStatus } : i
            ));
            alert(`Issue marked as ${newStatus}`);
        } catch (error) {
            alert('Failed to update: ' + error.response?.data?.message);
        } finally {
            setUpdating(null);
        }
    };

    const filteredIssues = issues.filter(issue => {
        const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getNextStatusOptions = (currentStatus) => {
        // Workflow: Pending -> In-Progress -> Working -> Resolved -> Closed
        const flow = ['pending', 'assigned', 'in-progress', 'working', 'resolved', 'closed'];
        const options = flow.filter(s => s !== currentStatus && s !== 'pending'); // Can't go back to pending usually?
        return options;
    };

    if (loading) return <div className="text-center py-10">Loading assignments...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Assigned Issues</h1>
                        <p className="text-gray-600">Manage and resolve your assigned tasks</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search issues..."
                            className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <select
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="assigned">Assigned</option>
                            <option value="in-progress">In Progress</option>
                            <option value="working">Working</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>

                {/* List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Issue</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Priority</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Location</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Update Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredIssues.map(issue => (
                                <tr key={issue._id} className={`hover:bg-gray-50/50 ${issue.isBoosted ? 'bg-purple-50/30' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded bg-gray-200 flex-shrink-0">
                                                {issue.photos?.[0] && <img src={issue.photos[0]} alt="" className="h-full w-full object-cover rounded" />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{issue.title}</div>
                                                <div className="text-xs text-gray-500">{new Date(issue.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                            ${issue.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                issue.priority === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                            {issue.priority}
                                        </span>
                                        {issue.isBoosted && (
                                            <span className="ml-2 px-2 py-1 rounded text-xs font-bold uppercase bg-purple-100 text-purple-700">
                                                Boosted
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium border border-gray-200 bg-white">
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs" title={issue.location.address}>
                                        {issue.location.address || 'No address'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            className="px-2 py-1 border border-gray-300 rounded text-sm bg-white hover:border-blue-500 cursor-pointer disabled:opacity-50"
                                            value=""
                                            onChange={(e) => handleStatusUpdate(issue._id, e.target.value)}
                                            disabled={updating === issue._id}
                                        >
                                            <option value="" disabled>Change Status...</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="working">Working</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                        {updating === issue._id && <FaSpinner className="inline ml-2 animate-spin text-blue-500" />}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link to={`/issues/${issue._id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredIssues.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-gray-500">
                                        No assigned issues found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AssignedIssues;
