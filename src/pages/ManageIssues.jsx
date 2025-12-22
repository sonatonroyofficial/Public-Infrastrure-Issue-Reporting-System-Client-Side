import { useState, useEffect } from 'react';
import { userAPI, issueAPI } from '../utils/api';
import { FaTasks, FaUserCheck, FaBan, FaCheck, FaTimes, FaSpinner, FaSortAmountDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ManageIssues = () => {
    const [issues, setIssues] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assignModal, setAssignModal] = useState({ isOpen: false, issueId: null });
    const [selectedStaff, setSelectedStaff] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [issuesRes, staffRes] = await Promise.all([
                issueAPI.getAllIssues(),
                userAPI.getAllUsers({ role: 'staff' })
            ]);

            // Sort issues: Boosted first, then by date
            const sortedIssues = issuesRes.data.issues.sort((a, b) => {
                if (a.isBoosted && !b.isBoosted) return -1;
                if (!a.isBoosted && b.isBoosted) return 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            setIssues(sortedIssues);
            setStaff(staffRes.data.users);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignClick = (issueId) => {
        setAssignModal({ isOpen: true, issueId });
        setSelectedStaff('');
    };

    const confirmAssign = async () => {
        if (!selectedStaff) return alert('Please select a staff member');
        setActionLoading(true);
        try {
            await issueAPI.assignIssue(assignModal.issueId, selectedStaff);

            // Update UI locally
            const assignedStaffMember = staff.find(s => s._id === selectedStaff);
            setIssues(issues.map(i =>
                i._id === assignModal.issueId
                    ? { ...i, assignedTo: selectedStaff, assignedStaffName: assignedStaffMember.name, status: 'assigned' }
                    : i
            ));

            alert('Issue assigned successfully');
            setAssignModal({ isOpen: false, issueId: null });
        } catch (error) {
            alert('Error assigning issue: ' + error.response?.data?.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (issueId) => {
        if (!window.confirm('Are you sure you want to REJECT this issue? This will notify the citizen.')) return;
        try {
            await issueAPI.rejectIssue(issueId);
            setIssues(issues.map(i =>
                i._id === issueId ? { ...i, status: 'rejected' } : i
            ));
        } catch (error) {
            alert('Error rejecting issue: ' + error.response?.data?.message);
        }
    };

    if (loading) return <div className="text-center py-10">Loading management console...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <FaTasks className="text-blue-600" /> Manage Issues
                </h1>
                <p className="text-gray-600">Oversee, assign, and manage reported issues.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Issue Details</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Priority</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Assigned Staff</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {issues.map(issue => (
                            <tr key={issue._id} className={`hover:bg-gray-50/50 ${issue.isBoosted ? 'bg-purple-50/30' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {issue.photos?.[0] ? (
                                            <img src={issue.photos[0]} alt="" className="h-10 w-10 rounded object-cover" />
                                        ) : (
                                            <div className="h-10 w-10 rounded bg-gray-200"></div>
                                        )}
                                        <div>
                                            <div className="font-bold text-gray-900 line-clamp-1">{issue.title}</div>
                                            <div className="text-xs text-gray-500 capitalize">{issue.category.replace('_', ' ')}</div>
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
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border border-gray-200 bg-white capitalize`}>
                                        {issue.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {issue.assignedStaffName ? (
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <FaUserCheck className="text-green-500" />
                                            {issue.assignedStaffName}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAssignClick(issue._id)}
                                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                                            disabled={issue.status === 'rejected' || issue.status === 'resolved' || issue.status === 'closed'}
                                        >
                                            Assign Staff
                                        </button>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link to={`/issues/${issue._id}`} className="text-gray-400 hover:text-blue-600 text-sm">View</Link>

                                        {issue.status === 'pending' && (
                                            <button
                                                onClick={() => handleReject(issue._id)}
                                                className="text-red-400 hover:text-red-600 p-1"
                                                title="Reject Issue"
                                            >
                                                <FaBan />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Assign Modal */}
            {assignModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Assign Staff Member</h3>
                        <p className="text-gray-600 text-sm mb-4">Select a staff member to handle this issue. They will be notified immediately.</p>

                        <select
                            className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={selectedStaff}
                            onChange={(e) => setSelectedStaff(e.target.value)}
                        >
                            <option value="">Select Staff...</option>
                            {staff.map(s => (
                                <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                            ))}
                        </select>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setAssignModal({ isOpen: false, issueId: null })}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAssign}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center"
                            >
                                {actionLoading ? <FaSpinner className="animate-spin" /> : 'Confirm Assignment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageIssues;
