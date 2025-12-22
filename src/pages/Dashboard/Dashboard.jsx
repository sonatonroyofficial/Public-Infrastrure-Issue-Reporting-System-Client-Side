import React from 'react';
import { FaExclamationCircle, FaTools, FaCheckDouble, FaUsers } from 'react-icons/fa';

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="stat bg-white shadow-xl rounded-xl">
                    <div className="stat-figure text-error">
                        <FaExclamationCircle className="text-3xl" />
                    </div>
                    <div className="stat-title">Pending Issues</div>
                    <div className="stat-value text-error">24</div>
                    <div className="stat-desc">Requires attention</div>
                </div>

                <div className="stat bg-white shadow-xl rounded-xl">
                    <div className="stat-figure text-warning">
                        <FaTools className="text-3xl" />
                    </div>
                    <div className="stat-title">In Progress</div>
                    <div className="stat-value text-warning">12</div>
                    <div className="stat-desc">Currently being fixed</div>
                </div>

                <div className="stat bg-white shadow-xl rounded-xl">
                    <div className="stat-figure text-success">
                        <FaCheckDouble className="text-3xl" />
                    </div>
                    <div className="stat-title">Resolved</div>
                    <div className="stat-value text-success">1,204</div>
                    <div className="stat-desc">This year</div>
                </div>

                <div className="stat bg-white shadow-xl rounded-xl">
                    <div className="stat-figure text-info">
                        <FaUsers className="text-3xl" />
                    </div>
                    <div className="stat-title">Total Users</div>
                    <div className="stat-value text-info">4,200</div>
                    <div className="stat-desc">↗︎ 400 (22%)</div>
                </div>
            </div>

            {/* Recent Activity / Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-white shadow-xl rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover">
                                    <td>Broken Streetlight</td>
                                    <td><div className="badge badge-error gap-2">Pending</div></td>
                                    <td>Oct 24, 2024</td>
                                </tr>
                                <tr className="hover">
                                    <td>Pothole on 5th Ave</td>
                                    <td><div className="badge badge-warning gap-2">In Progress</div></td>
                                    <td>Oct 23, 2024</td>
                                </tr>
                                <tr className="hover">
                                    <td>Water Leakage</td>
                                    <td><div className="badge badge-success gap-2">Resolved</div></td>
                                    <td>Oct 20, 2024</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button className="btn btn-sm btn-ghost mt-4">View All</button>
                </div>

                <div className="card bg-white shadow-xl rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">System Updates</h2>
                    <ul className="steps steps-vertical w-full">
                        <li className="step step-primary">System maintenance scheduled</li>
                        <li className="step step-primary">New category "Garbage" added</li>
                        <li className="step">Update privacy policy</li>
                        <li className="step">User survey results</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
