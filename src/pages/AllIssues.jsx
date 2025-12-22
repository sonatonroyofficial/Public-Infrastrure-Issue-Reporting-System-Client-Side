import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { issueAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaSearch, FaFilter, FaMapMarkerAlt, FaCalendarAlt, FaThumbsUp } from 'react-icons/fa';

const AllIssues = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [filters, setFilters] = useState({
        status: '',
        category: '',
        priority: '',
        search: ''
    });

    useEffect(() => {
        // Debounce search to prevent too many API calls
        const timer = setTimeout(() => {
            loadIssues();
        }, 500);

        return () => clearTimeout(timer);
    }, [filters]);

    const loadIssues = async () => {
        setLoading(true);
        try {
            // Clean filters to remove empty strings
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== '')
            );
            const response = await issueAPI.getAllIssues(activeFilters);
            setIssues(response.data.issues || []);
        } catch (error) {
            console.error('Error loading issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleUpvote = async (e, issue) => {
        e.preventDefault(); // Prevent navigation if button inside link
        e.stopPropagation();

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (issue.citizenId === user.userId) {
            alert("You cannot upvote your own issue.");
            return;
        }

        if (issue.upvotedBy?.includes(user.userId)) {
            alert("You have already upvoted this issue.");
            return;
        }

        try {
            const response = await issueAPI.upvoteIssue(issue._id);
            // Optimistic update
            setIssues(prevIssues =>
                prevIssues.map(i =>
                    i._id === issue._id
                        ? { ...i, upvotes: response.data.upvotes, upvotedBy: [...(i.upvotedBy || []), user.userId] }
                        : i
                )
            );
        } catch (error) {
            console.error('Upvote failed:', error);
            alert("Failed to upvote. Please try again.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'in-progress': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-50 text-red-700 border-red-200';
            case 'medium': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'low': return 'bg-green-50 text-green-700 border-green-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="py-12 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Reported Issues</h1>
                    <p className="text-lg text-gray-600">Browse community issues, track progress, and upvote important reports.</p>
                </div>

                {/* Filters and Search Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 sticky top-[80px] z-30">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative col-span-1 md:col-span-2 lg:col-span-1">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="search"
                                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Search..."
                                value={filters.search}
                                onChange={handleFilterChange}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                name="category"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                                value={filters.category}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Categories</option>
                                <option value="pothole">Pothole</option>
                                <option value="streetlight">Streetlight</option>
                                <option value="water_leakage">Water Leakage</option>
                                <option value="garbage">Garbage Overflow</option>
                                <option value="footpath">Damaged Footpath</option>
                                <option value="other">Other Issues</option>
                            </select>
                            <FaFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                name="status"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                                value={filters.status}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="assigned">Assigned</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                            <FaFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Priority Filter */}
                        <div className="relative">
                            <select
                                name="priority"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                                value={filters.priority}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Priorities</option>
                                <option value="high">High Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                            </select>
                            <FaFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Issues Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : issues.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No issues found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search query.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {issues.map((issue) => {
                            const isOwner = user?.userId === issue.citizenId;
                            const hasUpvoted = issue.upvotedBy?.includes(user?.userId);

                            return (
                                <div key={issue._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group">
                                    {/* Image */}
                                    <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                                        {issue.photos && issue.photos.length > 0 ? (
                                            <img
                                                src={issue.photos[0]}
                                                alt={issue.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-300 text-4xl">📷</div>
                                        )}
                                        {/* Priority Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider border shadow-sm ${getPriorityColor(issue.priority)} bg-white/90 backdrop-blur-sm`}>
                                                {issue.priority}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getStatusColor(issue.status)}`}>
                                                {issue.status}
                                            </span>
                                            <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded">
                                                {issue.category}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1" title={issue.title}>
                                            <Link to={`/issues/${issue._id}`} className="hover:text-blue-600 transition-colors">
                                                {issue.title}
                                            </Link>
                                        </h3>

                                        <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-red-400 flex-shrink-0" />
                                            <span className="truncate">{issue.location.address}</span>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
                                            {/* Upvote Button */}
                                            <button
                                                onClick={(e) => handleUpvote(e, issue)}
                                                disabled={isOwner} // Disable if owner
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${hasUpvoted
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'bg-gray-50 text-gray-600 hover:bg-white hover:shadow hover:text-blue-600 border border-transparent hover:border-gray-200'
                                                    } ${isOwner ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                title={isOwner ? "You cannot upvote your own issue" : "Upvote"}
                                            >
                                                <FaThumbsUp className={hasUpvoted ? '' : 'text-gray-400'} />
                                                <span>{issue.upvotes || 0}</span>
                                            </button>

                                            {/* View Details Button */}
                                            <Link
                                                to={`/issues/${issue._id}`}
                                                className="px-4 py-2 bg-white border border-blue-200 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                                            >
                                                <FaEye /> Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllIssues;
