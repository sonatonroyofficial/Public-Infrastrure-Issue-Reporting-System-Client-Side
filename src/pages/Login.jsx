import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(formData.email, formData.password);

        setIsLoading(false);

        if (result.success) {
            // Redirect based on role
            if (result.user.role === 'citizen') {
                navigate('/my-issues');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-icon">🏛️</div>
                        <h2>Welcome Back</h2>
                        <p>Sign in to your account to continue</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
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
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full btn-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                            ) : (
                                <>
                                    <FaSignInAlt /> Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/register">Create Account</Link></p>
                    </div>

                    <div className="demo-credentials">
                        <h4>Demo Credentials:</h4>
                        <div className="demo-grid">
                            <div>
                                <strong>Admin:</strong><br />
                                admin@test.com / admin123
                            </div>
                            <div>
                                <strong>Staff:</strong><br />
                                staff@test.com / staff123
                            </div>
                            <div>
                                <strong>Citizen:</strong><br />
                                citizen@test.com / citizen123
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
