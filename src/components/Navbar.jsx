import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
    const navOptions = <>
        <li><NavLink to="/" className={({ isActive }) => isActive ? "text-primary font-bold" : "font-medium"}>Home</NavLink></li>
        <li><NavLink to="/report" className={({ isActive }) => isActive ? "text-primary font-bold" : "font-medium"}>Report Issue</NavLink></li>
        <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-primary font-bold" : "font-medium"}>Dashboard</NavLink></li>
    </>;

    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4 md:px-8">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navOptions}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    CivicConnect
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">
                    {navOptions}
                </ul>
            </div>
            <div className="navbar-end gap-2">
                <Link to="/login" className="btn btn-sm btn-ghost">Login</Link>
                <Link to="/register" className="btn btn-sm btn-primary text-white">Get Started</Link>
            </div>
        </div>
    );
};

export default Navbar;
