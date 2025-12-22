import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaCheckCircle, FaUserShield, FaArrowRight } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="bg-base-100">
            {/* Hero Section */}
            <div className="hero min-h-[600px]" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)' }}>
                <div className="hero-overlay bg-opacity-70 bg-gray-900"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-2xl">
                        <h1 className="mb-5 text-5xl md:text-6xl font-extrabold leading-tight text-white">
                            See a <span className="text-primary">Problem?</span> <br />
                            Get it <span className="text-secondary">Fixed.</span>
                        </h1>
                        <p className="mb-8 text-lg text-gray-200">
                            CivicConnect empowers citizens to report infrastructure issues in seconds. From potholes to streetlights, we help build smarter, safer cities together.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/report" className="btn btn-primary btn-lg border-none hover:scale-105 transition-transform">
                                Report an Issue
                            </Link>
                            <Link to="/how-it-works" className="btn btn-outline btn-secondary btn-lg hover:scale-105 transition-transform text-white">
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-12 bg-base-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="stat bg-white shadow-xl rounded-2xl p-6 transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="stat-figure text-primary">
                                <FaMapMarkedAlt className="text-4xl" />
                            </div>
                            <div className="stat-title font-semibold text-gray-500">Issues Reported</div>
                            <div className="stat-value text-primary">1,204</div>
                            <div className="stat-desc">21% more than last month</div>
                        </div>
                        <div className="stat bg-white shadow-xl rounded-2xl p-6 transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="stat-figure text-secondary">
                                <FaCheckCircle className="text-4xl" />
                            </div>
                            <div className="stat-title font-semibold text-gray-500">Issues Resolved</div>
                            <div className="stat-value text-secondary">892</div>
                            <div className="stat-desc">High resolution rate</div>
                        </div>
                        <div className="stat bg-white shadow-xl rounded-2xl p-6 transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="stat-figure text-accent">
                                <FaUserShield className="text-4xl" />
                            </div>
                            <div className="stat-title font-semibold text-gray-500">Active Citizens</div>
                            <div className="stat-value text-accent">5,400+</div>
                            <div className="stat-desc">Making a difference</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Workflow Section */}
            <div className="py-20 container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
                <div className="flex flex-col md:flex-row gap-8 items-center relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>

                    <div className="card w-full bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300">
                        <div className="card-body items-center text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary font-bold text-2xl">1</div>
                            <h3 className="card-title text-2xl mb-2">Snap & Report</h3>
                            <p className="text-gray-500">Take a photo, add details, and submit your report in seconds.</p>
                        </div>
                    </div>
                    <div className="card w-full bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300">
                        <div className="card-body items-center text-center">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 text-secondary font-bold text-2xl">2</div>
                            <h3 className="card-title text-2xl mb-2">We Verify</h3>
                            <p className="text-gray-500">Our team verifies the issue and assigns it to the relevant department.</p>
                        </div>
                    </div>
                    <div className="card w-full bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300">
                        <div className="card-body items-center text-center">
                            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 text-accent font-bold text-2xl">3</div>
                            <h3 className="card-title text-2xl mb-2">Get Resolved</h3>
                            <p className="text-gray-500">Track progress in real-time until the issue is fixed.</p>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-12">
                    <button className="btn btn-wide btn-primary gap-2">
                        Get Started <FaArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
