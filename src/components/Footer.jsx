import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer" style={{ background: 'var(--dark-bg)', color: 'var(--dark-text)', paddingTop: '4rem', paddingBottom: '2rem' }}>
            <div className="container">
                <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
                    <div className="footer-col">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <div style={{ fontSize: '1.5rem' }}>🏛️</div>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.25rem' }}>InfraReport</h3>
                        </div>
                        <p style={{ color: 'var(--dark-text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                            Empowering citizens to build better communities through transparent infrastructure reporting and tracking.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="#" style={{ color: 'var(--dark-text-secondary)', fontSize: '1.25rem' }}><FaFacebook /></a>
                            <a href="#" style={{ color: 'var(--dark-text-secondary)', fontSize: '1.25rem' }}><FaTwitter /></a>
                            <a href="#" style={{ color: 'var(--dark-text-secondary)', fontSize: '1.25rem' }}><FaInstagram /></a>
                            <a href="#" style={{ color: 'var(--dark-text-secondary)', fontSize: '1.25rem' }}><FaLinkedin /></a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4 style={{ color: '#fff', marginBottom: '1.25rem' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.75rem' }}><Link to="/" style={{ color: 'var(--dark-text-secondary)', textDecoration: 'none' }}>Home</Link></li>
                            <li style={{ marginBottom: '0.75rem' }}><Link to="/issues" style={{ color: 'var(--dark-text-secondary)', textDecoration: 'none' }}>All Issues</Link></li>
                            <li style={{ marginBottom: '0.75rem' }}><Link to="/about" style={{ color: 'var(--dark-text-secondary)', textDecoration: 'none' }}>About Us</Link></li>
                            <li style={{ marginBottom: '0.75rem' }}><Link to="/contact" style={{ color: 'var(--dark-text-secondary)', textDecoration: 'none' }}>Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4 style={{ color: '#fff', marginBottom: '1.25rem' }}>Legal</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.75rem' }}><Link to="/privacy" style={{ color: 'var(--dark-text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link></li>
                            <li style={{ marginBottom: '0.75rem' }}><Link to="/terms" style={{ color: 'var(--dark-text-secondary)', textDecoration: 'none' }}>Terms of Service</Link></li>
                            <li style={{ marginBottom: '0.75rem' }}><Link to="/cookies" style={{ color: 'var(--dark-text-secondary)', textDecoration: 'none' }}>Cookie Policy</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4 style={{ color: '#fff', marginBottom: '1.25rem' }}>Contact Info</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.75rem', color: 'var(--dark-text-secondary)' }}>123 City Hall Avenue</li>
                            <li style={{ marginBottom: '0.75rem', color: 'var(--dark-text-secondary)' }}>Metro City, MC 10001</li>
                            <li style={{ marginBottom: '0.75rem', color: 'var(--dark-text-secondary)' }}>support@infrareport.gov</li>
                            <li style={{ marginBottom: '0.75rem', color: 'var(--dark-text-secondary)' }}>+1 (555) 123-4567</li>
                        </ul>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--dark-border)', paddingTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--dark-text-secondary)', fontSize: '0.875rem' }}>
                        &copy; {new Date().getFullYear()} InfraReport. All rights reserved. Built for better maintenance.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
