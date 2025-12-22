import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaUserPlus, FaCrown } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        role: 'citizen',
        isPremium: false
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        const { confirmPassword, ...registerData } = formData;
        const result = await register(registerData);

        setIsLoading(false);

        if (result.success) {
            navigate(result.user.role === 'citizen' ? '/my-issues' : '/dashboard');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card auth-card-large">
                    <div className="auth-header">
                        <div className="auth-icon">🏛️</div>
                        <h2>Create Account</h2>
                        <p>Join us in making cities better</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <FaUser /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <FaEnvelope /> Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <FaLock /> Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Minimum 6 characters"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <FaLock /> Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Re-enter password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <FaPhone /> Phone Number (Optional)
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="+1234567890"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <FaMapMarkerAlt /> Address (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Your city/area"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Account Type</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="citizen">Citizen</option>
                                <option value="staff">Government Staff</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>

                        {formData.role === 'citizen' && (
                            <div className="premium-checkbox">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="isPremium"
                                        checked={formData.isPremium}
                                        onChange={handleChange}
                                    />
                                    <span>
                                        <FaCrown className="premium-icon-inline" />
                                        Activate Premium Account (Priority Support)
                                    </span>
                                </label>
                                <p className="checkbox-help">
                                    Premium users get priority handling and faster response times
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-full btn-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                            ) : (
                                <>
                                    <FaUserPlus /> Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
