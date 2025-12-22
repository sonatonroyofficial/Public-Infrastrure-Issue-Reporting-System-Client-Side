import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaUserCircle,
    FaBars,
    FaTimes,
    FaSignOutAlt,
    FaTachometerAlt,
    FaCrown,
    FaHome,
    FaList,
    FaInfoCircle,
    FaEnvelope,
    FaCaretDown
} from 'react-icons/fa';

const Navbar = () => {
    const { isAuthenticated, user, logout, isPremium } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm h-18">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 no-underline" onClick={closeMobileMenu}>
                    <div className="text-3xl">🏛️</div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-slate-900 leading-none">InfraReport</span>
                        <span className="text-xs text-blue-600 font-medium tracking-wide">Public Infrastructure</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600 transition-colors">
                        <FaHome /> Home
                    </Link>
                    <Link to="/issues" className="flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600 transition-colors">
                        <FaList /> All Issues
                    </Link>
                    <Link to="/about" className="flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600 transition-colors">
                        <FaInfoCircle /> About
                    </Link>
                    <Link to="/contact" className="flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600 transition-colors">
                        <FaEnvelope /> Contact
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                onClick={toggleProfileDropdown}
                                title={user?.name}
                            >
                                <div className="relative">
                                    <FaUserCircle className="text-2xl text-slate-700" />
                                    {isPremium && <FaCrown className="absolute -top-1.5 -right-1.5 text-amber-400 text-xs drop-shadow-sm" />}
                                </div>
                                <FaCaretDown className={`text-slate-400 text-sm transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-4 bg-slate-50 border-b border-slate-100">
                                        <div className="font-bold text-slate-900 truncate">{user?.name}</div>
                                        <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mt-0.5">{user?.role}</div>
                                    </div>
                                    <div className="p-1">
                                        <Link
                                            to={user?.role === 'citizen' ? '/my-issues' : '/dashboard'}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                        >
                                            <FaTachometerAlt /> Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors text-left"
                                        >
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                Login
                            </Link>
                            <Link to="/register" className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow hover:-translate-y-0.5 transition-all">
                                Get Started
                            </Link>
                        </div>
                    )}

                    <button
                        className="md:hidden text-2xl text-slate-700 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed top-[72px] left-0 right-0 bottom-0 bg-white z-40 overflow-y-auto border-t border-slate-100 animate-in slide-in-from-top-5 duration-200">
                    <div className="p-4 flex flex-col gap-2">
                        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 rounded-xl" onClick={closeMobileMenu}>
                            <FaHome /> Home
                        </Link>
                        <Link to="/issues" className="flex items-center gap-3 px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 rounded-xl" onClick={closeMobileMenu}>
                            <FaList /> All Issues
                        </Link>
                        <Link to="/about" className="flex items-center gap-3 px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 rounded-xl" onClick={closeMobileMenu}>
                            <FaInfoCircle /> About
                        </Link>
                        <Link to="/contact" className="flex items-center gap-3 px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 rounded-xl" onClick={closeMobileMenu}>
                            <FaEnvelope /> Contact
                        </Link>

                        <div className="my-2 border-t border-slate-100"></div>

                        {isAuthenticated ? (
                            <>
                                <div className="px-4 py-2 text-sm text-slate-500 font-semibold uppercase tracking-wider">
                                    Signed in as {user?.name}
                                </div>
                                <Link to={user?.role === 'citizen' ? '/my-issues' : '/dashboard'} className="flex items-center gap-3 px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 rounded-xl" onClick={closeMobileMenu}>
                                    <FaTachometerAlt /> Dashboard
                                </Link>
                                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl text-left w-full">
                                    <FaSignOutAlt /> Logout
                                </button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <Link to="/login" className="flex justify-center px-4 py-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl" onClick={closeMobileMenu}>
                                    Login
                                </Link>
                                <Link to="/register" className="flex justify-center px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm" onClick={closeMobileMenu}>
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
