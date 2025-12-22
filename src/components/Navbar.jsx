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
import './Navbar.css';

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
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    <div className="logo-icon">🏛️</div>
                    <div className="logo-text">
                        <span className="logo-main">InfraReport</span>
                        <span className="logo-sub">Public Infrastructure</span>
                    </div>
                </Link>

                <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link" onClick={closeMobileMenu}>
                        <FaHome /> Home
                    </Link>
                    <Link to="/issues" className="nav-link" onClick={closeMobileMenu}>
                        <FaList /> All Issues
                    </Link>
                    <Link to="/about" className="nav-link" onClick={closeMobileMenu}>
                        <FaInfoCircle /> About
                    </Link>
                    <Link to="/contact" className="nav-link" onClick={closeMobileMenu}>
                        <FaEnvelope /> Contact
                    </Link>

                    {/* Mobile Only Auth Links */}
                    <div className="mobile-auth-links">
                        {isAuthenticated ? (
                            <>
                                <div className="mobile-user-info">
                                    <FaUserCircle /> {user?.name}
                                </div>
                                <Link to={user?.role === 'citizen' ? '/my-issues' : '/dashboard'} className="nav-link" onClick={closeMobileMenu}>
                                    <FaTachometerAlt /> Dashboard
                                </Link>
                                <button onClick={handleLogout} className="nav-link logout-btn-mobile">
                                    <FaSignOutAlt /> Logout
                                </button>
                            </>
                        ) : (
                            <div className="mobile-auth-buttons">
                                <Link to="/login" className="btn btn-ghost btn-sm" onClick={closeMobileMenu}>Login</Link>
                                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMobileMenu}>Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <div className="navbar-user-dropdown" ref={dropdownRef}>
                            <div
                                className="user-profile-trigger"
                                onClick={toggleProfileDropdown}
                                title={user?.name}
                            >
                                <FaUserCircle className="user-avatar" />
                                {isPremium && <FaCrown className="premium-badge-icon" />}
                                <FaCaretDown className={`dropdown-caret ${isProfileDropdownOpen ? 'open' : ''}`} />
                            </div>

                            {isProfileDropdownOpen && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-header">
                                        <div className="dropdown-user-name">{user?.name}</div>
                                        <div className="dropdown-user-role">{user?.role}</div>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <Link
                                        to={user?.role === 'citizen' ? '/my-issues' : '/dashboard'}
                                        className="dropdown-item"
                                        onClick={() => setIsProfileDropdownOpen(false)}
                                    >
                                        <FaTachometerAlt /> Dashboard
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-item text-danger">
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons desktop-only">
                            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                        </div>
                    )}

                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
