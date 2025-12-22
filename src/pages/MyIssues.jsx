import { useState, useEffect } from 'react';
import { issueAPI } from '../utils/api';
import { FaEye, FaCommentAlt } from 'react-icons/fa';

const MyIssues = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState(null);

    useEffect(() => {
        loadIssues();
    }, []);

    const loadIssues = async () => {
        try {
            const response = await issueAPI.getAllIssues();
            setIssues(response.data.issues);
        } catch (error) {
            console.error('Error loading issues:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', minHeight: 'calc(100vh - 72px)' }}>
            <div className="container">
                <h1>My Reported Issues</h1>
                <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
                    Track the status of all your reported issues
                </p>

                {issues.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ fontSize: '1.25rem', color: 'var(--gray-600)' }}>
                            You haven't reported any issues yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {issues.map((issue) => (
                            <div key={issue._id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{issue.title}</h3>
                                    {issue.isPremiumIssue && (
                                        <span className="badge badge-premium" style={{ fontSize: '0.75rem' }}>Premium</span>
                                    )}
                                </div>

                                <div style={{ marginBottom: '0.75rem' }}>
                                    <span className="badge badge-normal">{issue.category}</span>
                                    <span className={`badge badge-${issue.status}`} style={{ marginLeft: '0.5rem' }}>
                                        {issue.status}
                                    </span>
                                    <span className={`badge badge-${issue.priority}`} style={{ marginLeft: '0.5rem' }}>
                                        {issue.priority}
                                    </span>
                                </div>

                                <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                                    {issue.description.substring(0, 100)}...
                                </p>

                                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
                                    <div>📍 {issue.location.address}</div>
                                    <div>📅 {new Date(issue.createdAt).toLocaleDateString()}</div>
                                    {issue.assignedStaffName && (
                                        <div>👤 Assigned to: {issue.assignedStaffName}</div>
                                    )}
                                </div>

                                {issue.photos && issue.photos.length > 0 && (
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
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
                                    className="btn btn-outline btn-sm w-full"
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <h2>{selectedIssue.title}</h2>
                                <button onClick={() => setSelectedIssue(null)} className="btn btn-ghost">✕</button>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <span className="badge badge-normal">{selectedIssue.category}</span>
                                <span className={`badge badge-${selectedIssue.status}`} style={{ marginLeft: '0.5rem' }}>
                                    {selectedIssue.status}
                                </span>
                                <span className={`badge badge-${selectedIssue.priority}`} style={{ marginLeft: '0.5rem' }}>
                                    {selectedIssue.priority}
                                </span>
                            </div>

                            <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{selectedIssue.description}</p>

                            <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: '8px' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>Location</h4>
                                <p>{selectedIssue.location.address}</p>
                                {selectedIssue.location.latitude && selectedIssue.location.longitude && (
                                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                                        Coordinates: {selectedIssue.location.latitude}, {selectedIssue.location.longitude}
                                    </p>
                                )}
                            </div>

                            {selectedIssue.photos && selectedIssue.photos.length > 0 && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <h4 style={{ marginBottom: '0.5rem' }}>Photos</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem' }}>
                                        {selectedIssue.photos.map((photo, index) => (
                                            <img
                                                key={index}
                                                src={photo}
                                                alt={`Issue ${index + 1}`}
                                                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedIssue.statusHistory && selectedIssue.statusHistory.length > 0 && (
                                <div>
                                    <h4 style={{ marginBottom: '0.5rem' }}>Status History</h4>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {selectedIssue.statusHistory.map((history, index) => (
                                            <div key={index} style={{ padding: '0.75rem', background: 'var(--gray-50)', borderRadius: '6px', marginBottom: '0.5rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                    <span className={`badge badge-${history.status}`}>{history.status}</span>
                                                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                                                        {new Date(history.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>{history.comment}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>by {history.updatedBy}</p>
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

export default MyIssues;
