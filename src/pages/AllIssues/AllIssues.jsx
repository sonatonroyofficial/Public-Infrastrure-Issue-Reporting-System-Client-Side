import React from 'react';

const AllIssues = () => {
    return (
        <div className="min-h-screen pt-20 px-4">
            <h1 className="text-3xl font-bold text-center mb-8">All Reported Issues</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto">
                {/* Mock Data Card */}
                <div className="card bg-base-100 shadow-xl border border-base-200">
                    <figure><img src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Pothole" /></figure>
                    <div className="card-body">
                        <h2 className="card-title">
                            Pothole on Main St.
                            <div className="badge badge-warning">In Progress</div>
                        </h2>
                        <p>Large pothole causing traffic slowdown near the school.</p>
                        <div className="card-actions justify-end mt-4">
                            <div className="badge badge-outline">Roads</div>
                            <div className="badge badge-outline">5th Ave</div>
                        </div>
                    </div>
                </div>

                {/* Mock Data Card 2 */}
                <div className="card bg-base-100 shadow-xl border border-base-200">
                    <figure><img src="https://images.unsplash.com/photo-1584463635397-6a583d7350cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Streetlight" /></figure>
                    <div className="card-body">
                        <h2 className="card-title">
                            Broken Streetlight
                            <div className="badge badge-error">Pending</div>
                        </h2>
                        <p>Streetlight flickering and then went off completely.</p>
                        <div className="card-actions justify-end mt-4">
                            <div className="badge badge-outline">Lights</div>
                            <div className="badge badge-outline">Park Lane</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllIssues;
