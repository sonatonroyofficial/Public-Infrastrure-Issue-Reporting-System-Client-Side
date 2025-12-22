import React from 'react';

const Contact = () => {
    return (
        <div className="min-h-screen pt-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 mb-8">
                Have questions or suggestions? Reach out to us!
            </p>
            <div className="card w-96 mx-auto bg-base-100 shadow-xl border border-base-200">
                <div className="card-body">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Email</span></label>
                        <input type="email" placeholder="hello@civicconnect.com" className="input input-bordered" disabled />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
