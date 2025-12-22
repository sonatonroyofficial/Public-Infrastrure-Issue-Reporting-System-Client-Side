import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider';

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);

    const handleLogOut = () => {
        logOut()
            .then(() => console.log("Logged out successfully"))
            .catch(error => console.error(error));
    };

    const navOptions = <>
        <li><NavLink to="/" className={({ isActive }) => isActive ? "text-primary font-bold" : "font-medium"}>Home</NavLink></li>
        <li><NavLink to="/issues" className={({ isActive }) => isActive ? "text-primary font-bold" : "font-medium"}>All Issues</NavLink></li>
        <li><NavLink to="/about" className={({ isActive }) => isActive ? "text-primary font-bold" : "font-medium"}>About</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? "text-primary font-bold" : "font-medium"}>Contact</NavLink></li>
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
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img alt="User Profile" src={user?.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <a className="justify-between">
                                    {user?.displayName || "User"}
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><button onClick={handleLogOut}>Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-sm btn-ghost">Login</Link>
                        <Link to="/register" className="btn btn-sm btn-primary text-white">Get Started</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
