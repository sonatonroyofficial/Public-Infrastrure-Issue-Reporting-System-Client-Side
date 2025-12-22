import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issueAPI } from '../utils/api';
import {
    FaLightbulb,
    FaRoad,
    FaTint,
    FaTrash,
    FaUserShield,
    FaChartLine,
    FaClock,
    FaCheckCircle,
    FaArrowRight,
    FaStar,
    FaMobileAlt,
    FaApple,
    FaGooglePlay,
    FaPaperPlane
} from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const { isAuthenticated, isCitizen } = useAuth();
    const [latestResolvedIssues, setLatestResolvedIssues] = useState([]);
    const [loadingIssues, setLoadingIssues] = useState(true);

    useEffect(() => {
        const fetchResolvedIssues = async () => {
            try {
                // Fetch issues and filter/sort
                const response = await issueAPI.getAllIssues();
                const issues = response.data.issues || [];
                // Filter for resolved issues and sort by most recent update
                const resolved = issues
                    .filter(issue => issue.status === 'resolved')
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .slice(0, 6);
                setLatestResolvedIssues(resolved);
            } catch (error) {
                console.error("Failed to fetch resolved issues", error);
            } finally {
                setLoadingIssues(false);
            }
        };

        fetchResolvedIssues();
    }, []);

    const features = [
        {
            icon: <FaLightbulb />,
            title: 'Easy Reporting',
            description: 'Report infrastructure issues with photos and location in seconds'
        },
        {
            icon: <FaClock />,
            title: 'Real-time Tracking',
            description: 'Track your reported issues from submission to resolution'
        },
        {
            icon: <FaUserShield />,
            title: 'Verified Staff',
            description: 'Issues are handled by verified government staff members'
        },
        {
            icon: <FaCheckCircle />,
            title: 'Quick Resolution',
            description: 'Priority system ensures faster response to critical issues'
        }
    ];

    const issueTypes = [
        { icon: <FaRoad />, name: 'Potholes', color: '#f59e0b' },
        { icon: <FaLightbulb />, name: 'Streetlights', color: '#3b82f6' },
        { icon: <FaTint />, name: 'Water Leakage', color: '#06b6d4' },
        { icon: <FaTrash />, name: 'Garbage Overflow', color: '#ef4444' },
        { icon: <FaRoad />, name: 'Damaged Footpaths', color: '#8b5cf6' },
        { icon: <FaChartLine />, name: 'Other Issues', color: '#10b981' }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <div className="hero-badge">
                                🏛️ Building Better Cities Together
                            </div>
                            <h1 className="hero-title">
                                Report Public Infrastructure
                                <span className="gradient-text"> Issues Instantly</span>
                            </h1>
                            <p className="hero-description">
                                Help improve your community by reporting broken streetlights, potholes,
                                water leakage, and other infrastructure issues. Track progress in real-time
                                and make your city a better place to live.
                            </p>
                            <div className="hero-actions">
                                {isAuthenticated && isCitizen ? (
                                    <Link to="/report-issue" className="btn btn-primary btn-lg">
                                        <FaArrowRight /> Report an Issue
                                    </Link>
                                ) : (
                                    <Link to="/register" className="btn btn-primary btn-lg">
                                        <FaArrowRight /> Get Started Free
                                    </Link>
                                )}
                                <Link to="/about" className="btn btn-outline btn-lg">
                                    Learn More
                                </Link>
                            </div>
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <div className="stat-value">1000+</div>
                                    <div className="stat-label">Issues Reported</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">850+</div>
                                    <div className="stat-label">Issues Resolved</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">95%</div>
                                    <div className="stat-label">Satisfaction Rate</div>
                                </div>
                            </div>
                        </div>
                        <div className="hero-image">
                            <div className="floating-card card-1">
                                <div className="card-icon">🚧</div>
                                <div className="card-content">
                                    <div className="card-title">Pothole Reported</div>
                                    <div className="card-status status-pending">Pending Review</div>
                                </div>
                            </div>
                            <div className="floating-card card-2">
                                <div className="card-icon">💡</div>
                                <div className="card-content">
                                    <div className="card-title">Streetlight Fixed</div>
                                    <div className="card-status status-resolved">Resolved</div>
                                </div>
                            </div>
                            <div className="floating-card card-3">
                                <div className="card-icon">💧</div>
                                <div className="card-content">
                                    <div className="card-title">Water Leak</div>
                                    <div className="card-status status-progress">In Progress</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Resolved Issues Section */}
            <section className="resolved-issues-section" style={{ padding: 'var(--spacing-3xl) 0', background: 'var(--gray-50)' }}>
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Latest Resolved Issues</h2>
                        <p>See how we are making a difference, one issue at a time.</p>
                    </div>

                    {loadingIssues ? (
                        <div className="text-center py-10">
                            <div className="spinner mx-auto"></div>
                        </div>
                    ) : latestResolvedIssues.length > 0 ? (
                        <div className="grid grid-3 gap-lg">
                            {latestResolvedIssues.map(issue => (
                                <div key={issue._id} className="card hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-2">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="badge badge-resolved flex items-center gap-2">
                                            <FaCheckCircle /> Resolved
                                        </span>
                                        <span className="text-sm text-gray-500">{new Date(issue.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 truncate">{issue.title}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2 h-12 overflow-hidden">
                                        {issue.description}
                                    </p>
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>📍</span>
                                            <span className="truncate">{issue.location.address}</span>
                                        </div>
                                    </div>
                                    {issue.photos && issue.photos.length > 0 && (
                                        <div className="h-40 mb-4 rounded-lg overflow-hidden">
                                            <img src={issue.photos[0]} alt="Resolved Issue" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <Link to="/issues" className="btn btn-outline btn-sm w-full mt-auto">
                                        View Details
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            <p>No recently resolved issues to display.</p>
                        </div>
                    )}

                    <div className="text-center mt-xl">
                        <Link to="/issues" className="btn btn-primary">
                            View All Issues
                        </Link>
                    </div>
                </div>
            </section>

            {/* Issue Types Section */}
            <section className="issue-types-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>What Can You Report?</h2>
                        <p>We handle a wide range of public infrastructure issues</p>
                    </div>
                    <div className="issue-types-grid">
                        {issueTypes.map((type, index) => (
                            <div key={index} className="issue-type-card" style={{ '--accent-color': type.color }}>
                                <div className="issue-type-icon">{type.icon}</div>
                                <div className="issue-type-name">{type.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Why Choose InfraReport?</h2>
                        <p>Making city service delivery more efficient and transparent</p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Extra Section 1: Community Impact */}
            <section className="impact-section" style={{ padding: 'var(--spacing-3xl) 0', background: 'white' }}>
                <div className="container">
                    <div className="grid grid-2 gap-2xl items-center">
                        <div>
                            <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                                <h2>Our Community Impact</h2>
                                <p>Together we are transforming our city into a safer, cleaner, and more efficient place for everyone.</p>
                            </div>
                            <div className="grid grid-2 gap-lg mb-lg">
                                <div className="p-4 bg-blue-50 rounded-xl text-center">
                                    <h3 className="text-3xl font-bold text-blue-600 mb-1">50+</h3>
                                    <p className="text-gray-600">Communities Served</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-xl text-center">
                                    <h3 className="text-3xl font-bold text-green-600 mb-1">12hr</h3>
                                    <p className="text-gray-600">Avg. Response Time</p>
                                </div>
                            </div>
                            <div className="testimonial mb-lg p-6 border-l-4 border-primary-500 bg-gray-50 rounded-r-xl">
                                <p className="italic text-gray-700 mb-4">"The response time for the streetlight repair I reported was incredible. It makes me feel heard as a citizen."</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold">JD</div>
                                    <div>
                                        <h5 className="font-bold text-gray-900">John Doe</h5>
                                        <span className="text-sm text-gray-500">Local Resident</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-full min-h-[400px]">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl opacity-10 transform rotate-3"></div>
                            <div className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                                {/* Placeholder for map or impact image */}
                                <div className="text-center p-8">
                                    <FaChartLine className="text-6xl text-primary-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-800">Real Impact, Real Time</h3>
                                    <p className="text-gray-500 mt-2">Visualizing change across the city.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>How It Works</h2>
                        <p>Simple 4-step process to report and resolve issues</p>
                    </div>
                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Submit Report</h3>
                                <p>Citizens submit reports with photos and location details</p>
                            </div>
                        </div>
                        <div className="step-arrow">→</div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Admin Review</h3>
                                <p>Admin reviews and assigns the issue to appropriate staff</p>
                            </div>
                        </div>
                        <div className="step-arrow">→</div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Staff Action</h3>
                                <p>Staff verifies and updates progress in real-time</p>
                            </div>
                        </div>
                        <div className="step-arrow">→</div>
                        <div className="step">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Issue Resolved</h3>
                                <p>Citizens receive updates and confirmation of resolution</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Extra Section 2: Mobile App / Newsletter */}
            <section className="app-download-section py-20 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600 opacity-20 transform skew-x-12 translate-x-20"></div>
                <div className="container relative z-10">
                    <div className="grid grid-2 gap-2xl items-center">
                        <div>
                            <span className="inline-block py-1 px-3 rounded-full bg-primary-600 text-xs font-bold uppercase tracking-wider mb-4">Coming Soon</span>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Report Issues on the Go</h2>
                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                Download our mobile app to report issues directly from your phone.
                                Enable location services for automatic geotagging and receive push notifications on updates.
                            </p>
                            <div className="flex gap-4">
                                <button className="btn bg-white text-gray-900 hover:bg-gray-100 border-none flex items-center gap-3 px-6 py-3 h-auto">
                                    <FaApple className="text-2xl" />
                                    <div className="text-left leading-tight">
                                        <span className="block text-xs uppercase text-gray-500 font-bold">Download on the</span>
                                        <span className="block font-bold">App Store</span>
                                    </div>
                                </button>
                                <button className="btn border border-gray-600 text-white hover:bg-gray-800 flex items-center gap-3 px-6 py-3 h-auto">
                                    <FaGooglePlay className="text-xl" />
                                    <div className="text-left leading-tight">
                                        <span className="block text-xs uppercase text-gray-400 font-bold">Get it on</span>
                                        <span className="block font-bold">Google Play</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary-500 blur-3xl opacity-30"></div>
                                <FaMobileAlt style={{ fontSize: '18rem', opacity: 0.8 }} className="relative z-10 text-gray-400 drop-shadow-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Make a Difference?</h2>
                        <p>Join thousands of citizens making their communities better</p>
                        {!isAuthenticated && (
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Create Free Account
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
