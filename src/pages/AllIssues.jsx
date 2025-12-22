import { useState, useEffect } from 'react';
import { issueAPI } from '../utils/api';
import { FaEye, FaSearch, FaFilter } from 'react-icons/fa';

const AllIssues = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadIssues();
    }, []);

    const loadIssues = async () => {
        try {
            // Passing empty object as params for now, assuming backend returns all
            const response = await issueAPI.getAllIssues();
            setIssues(response.data.issues || []);
        } catch (error) {
            console.error('Error loading issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredIssues = issues.filter(issue => {
        const matchesFilter = filter === 'all' || issue.status === filter;
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem 0', minHeight: 'calc(100vh - 72px)' }}>
            <div className="container">
                <div className="section-header text-center mb-xl">
                    <h1>Community Issues</h1>
                    <p>See what's happening in your neighborhood and track resolution progress.</p>
                </div>

                {/* Filters and Search */}
                <div className="card mb-lg" style={{ padding: '1.5rem' }}>
                    <div className="flex flex-col gap-md">
                        <div className="flex gap-md items-center" style={{ flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Search issues..."
                                    style={{ paddingLeft: '2.5rem' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-sm items-center">
                                <FaFilter style={{ color: 'var(--gray-500)' }} />
                                <select
                                    className="form-select"
                                    style={{ width: 'auto' }}
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {filteredIssues.length === 0 ? (
                    <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        <h3>No issues found</h3>
                        <p style={{ color: 'var(--gray-600)' }}>Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {filteredIssues.map((issue) => (
                            <div key={issue._id} className="card hover:shadow-lg transition-all duration-300">
                                <div className="flex justify-between items-start mb-md">
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>{issue.title}</h3>
                                    {issue.isPremiumIssue && (
                                        <span className="badge badge-premium" style={{ fontSize: '0.7rem' }}>Premium</span>
                                    )}
                                </div>

                                <div className="flex gap-sm mb-md flex-wrap">
                                    <span className={`badge badge-${issue.status}`}>{issue.status}</span>
                                    <span className="badge badge-normal">{issue.category}</span>
                                </div>

                                <p className="mb-md" style={{ color: 'var(--gray-600)', fontSize: '0.95rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                    {issue.description}
                                </p>

                                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
                                    <div className="flex items-center gap-sm mb-sm">📍 <span className="truncate">{issue.location.address}</span></div>
                                    <div className="flex items-center gap-sm">📅 {new Date(issue.createdAt).toLocaleDateString()}</div>
                                </div>

                                {issue.photos && issue.photos.length > 0 && (
                                    <div className="flex gap-sm mb-md overflow-hidden">
                                        {issue.photos.slice(0, 3).map((photo, index) => (
                                            <img
                                                key={index}
                                                src={photo}
                                                alt={`Issue ${index + 1}`}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                                            />
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={() => setSelectedIssue(issue)}
                                    className="btn btn-outline btn-sm w-full mt-auto"
                                >
                                    <FaEye /> View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Issue Details Modal */}
                {selectedIssue && (
                    <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
                            <div className="flex justify-between items-start mb-lg">
                                <h2>{selectedIssue.title}</h2>
                                <button onClick={() => setSelectedIssue(null)} className="btn btn-ghost" style={{ fontSize: '1.5rem', padding: '0.5rem' }}>&times;</button>
                            </div>

                            <div className="flex gap-sm mb-lg">
                                <span className={`badge badge-${selectedIssue.status}`}>{selectedIssue.status}</span>
                                <span className={`badge badge-${selectedIssue.priority}`}>{selectedIssue.priority} Priority</span>
                                <span className="badge badge-normal">{selectedIssue.category}</span>
                            </div>

                            <div className="mb-lg">
                                <h4 className="mb-sm text-gray-700">Description</h4>
                                <p className="text-gray-600 leading-relaxed">{selectedIssue.description}</p>
                            </div>

                            <div className="mb-lg p-md bg-gray-50 rounded-lg border border-gray-100">
                                <h4 className="mb-sm text-gray-700">Location</h4>
                                <p className="text-gray-900">{selectedIssue.location.address}</p>
                            </div>

                            {selectedIssue.photos && selectedIssue.photos.length > 0 && (
                                <div className="mb-lg">
                                    <h4 className="mb-sm text-gray-700">Photos</h4>
                                    <div className="grid grid-2 gap-sm">
                                        {selectedIssue.photos.map((photo, index) => (
                                            <img
                                                key={index}
                                                src={photo}
                                                alt={`Issue ${index + 1}`}
                                                className="w-full h-48 object-cover rounded-md border border-gray-200"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedIssue.statusHistory && selectedIssue.statusHistory.length > 0 && (
                                <div>
                                    <h4 className="mb-sm text-gray-700">Updates</h4>
                                    <div className="max-h-60 overflow-y-auto space-y-sm">
                                        {selectedIssue.statusHistory.map((history, index) => (
                                            <div key={index} className="p-sm bg-gray-50 rounded border border-gray-100">
                                                <div className="flex justify-between items-center mb-xs">
                                                    <span className={`badge badge-${history.status} text-xs`}>{history.status}</span>
                                                    <span className="text-xs text-gray-500">{new Date(history.timestamp).toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-700">{history.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllIssues;
