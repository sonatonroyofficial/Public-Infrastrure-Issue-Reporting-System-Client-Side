import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { issueAPI } from '../utils/api';
import { FaCamera, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const ReportIssue = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'pothole',
        location: {
            address: '',
            latitude: '',
            longitude: ''
        },
        photos: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        { value: 'pothole', label: 'Pothole' },
        { value: 'streetlight', label: 'Broken Streetlight' },
        { value: 'water_leakage', label: 'Water Leakage' },
        { value: 'garbage', label: 'Garbage Overflow' },
        { value: 'footpath', label: 'Damaged Footpath' },
        { value: 'other', label: 'Other' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('location.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                location: { ...formData.location, [field]: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const maxFiles = 3;

        if (files.length > maxFiles) {
            setError(`Maximum ${maxFiles} images allowed`);
            return;
        }

        const promises = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises)
            .then(base64Images => {
                setFormData({ ...formData, photos: base64Images });
                setError('');
            })
            .catch(() => setError('Error uploading images'));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await issueAPI.createIssue(formData);
            alert('Issue reported successfully!');
            navigate('/my-issues');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to report issue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', minHeight: 'calc(100vh - 72px)' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="card">
                    <h1 style={{ marginBottom: '0.5rem' }}>Report an Issue</h1>
                    <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
                        Help us improve your community by reporting infrastructure issues
                    </p>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Issue Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Brief description of the issue"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-textarea"
                                placeholder="Provide detailed information about the issue..."
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaMapMarkerAlt /> Location Address *
                            </label>
                            <input
                                type="text"
                                name="location.address"
                                value={formData.location.address}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Street address or landmark"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Latitude (Optional)</label>
                                <input
                                    type="number"
                                    step="any"
                                    name="location.latitude"
                                    value={formData.location.latitude}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="23.8103"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Longitude (Optional)</label>
                                <input
                                    type="number"
                                    step="any"
                                    name="location.longitude"
                                    value={formData.location.longitude}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="90.4125"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaCamera /> Upload Photos (Max 3)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="form-input"
                            />
                            {formData.photos.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                    {formData.photos.map((photo, index) => (
                                        <img
                                            key={index}
                                            src={photo}
                                            alt={`Preview ${index + 1}`}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isLoading}>
                            {isLoading ? (
                                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                            ) : (
                                <>
                                    <FaPaperPlane /> Submit Report
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportIssue;
