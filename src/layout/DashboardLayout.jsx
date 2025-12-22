import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaHome, FaList, FaUserCog, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';

const DashboardLayout = () => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col bg-base-200 min-h-screen">
                {/* Mobile Navbar */}
                <div className="navbar bg-base-100 lg:hidden shadow-sm">
                    <div className="flex-none">
                        <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>
                    </div>
                    <div className="flex-1">
                        <Link to="/" className="btn btn-ghost text-xl">CivicConnect</Link>
                    </div>
                </div>

                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </div>
            <div className="drawer-side z-20">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content shadow-xl gap-2">
                    {/* Sidebar Header */}
                    <div className="mb-6 px-2">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">CivicConnect</h2>
                        <div className="badge badge-secondary badge-outline mt-2">Admin View</div>
                    </div>

                    <li><Link to="/dashboard" className="font-medium"><FaHome /> Overview</Link></li>
                    <li><Link to="/dashboard/issues" className="font-medium"><FaList /> Manage Issues</Link></li>
                    <li><Link to="/dashboard/users" className="font-medium"><FaUserCog /> Manage Users</Link></li>
                    <li><Link to="/report" className="font-medium"><FaClipboardList /> Report New Issue</Link></li>

                    <div className="divider"></div>

                    <li><Link to="/" className="font-medium">Back to Home</Link></li>
                    <li><a className="font-medium text-error"><FaSignOutAlt /> Logout</a></li>
                </ul>

            </div>
        </div>
    );
};

export default DashboardLayout;
