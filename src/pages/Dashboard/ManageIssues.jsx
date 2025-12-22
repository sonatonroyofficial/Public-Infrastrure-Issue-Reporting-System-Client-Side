import React, { useState } from 'react';

const ManageIssues = () => {
    // Mock Data
    const [issues, setIssues] = useState([
        { id: 1, title: "Broken Streetlight", location: "5th Ave", status: "Pending", reportedBy: "John Doe", date: "2024-10-24" },
        { id: 2, title: "Pothole", location: "Main St", status: "In Progress", reportedBy: "Jane Smith", date: "2024-10-23" },
        { id: 3, title: "Water Leakage", location: "Park Lane", status: "Resolved", reportedBy: "Mike", date: "2024-10-20" },
    ]);

    const handleStatusChange = (id, newStatus) => {
        setIssues(issues.map(issue => issue.id === id ? { ...issue, status: newStatus } : issue));
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Manage Issues</h2>
            <div className="overflow-x-auto bg-white rounded-xl shadow-xl">
                <table className="table w-full">
                    {/* head */}
                    <thead>
                        <tr className="bg-base-200">
                            <th>ID</th>
                            <th>Title & Location</th>
                            <th>Reported By</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map((issue) => (
                            <tr key={issue.id} className="hover">
                                <th>{issue.id}</th>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <div className="font-bold">{issue.title}</div>
                                            <div className="text-sm opacity-50">{issue.location}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{issue.reportedBy}</td>
                                <td>{issue.date}</td>
                                <td>
                                    <span className={`badge ${issue.status === 'Resolved' ? 'badge-success' :
                                            issue.status === 'In Progress' ? 'badge-warning' : 'badge-error'
                                        } gap-2`}>
                                        {issue.status}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        className="select select-bordered select-xs w-full max-w-xs"
                                        value={issue.status}
                                        onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageIssues;
