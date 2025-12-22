import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCloudUploadAlt } from 'react-icons/fa';

const ReportIssue = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = (data) => {
        console.log(data);
        // Handle text submission and image upload separately or together
        // Need to use FormData for specific image handling if sending to backend
    };

    return (
        <div className="min-h-screen bg-base-100 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8">Report an Issue</h1>
                <div className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* Title */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">Issue Title</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Pothole on Main St"
                                    className="input input-bordered w-full"
                                    {...register("title", { required: true })}
                                />
                                {errors.title && <span className="text-error text-sm">Title is required</span>}
                            </div>

                            {/* Category */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">Category</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    {...register("category", { required: true })}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select category</option>
                                    <option value="Roads">Roads & Footpaths</option>
                                    <option value="Streetlights">Streetlights</option>
                                    <option value="Water">Water Leakage</option>
                                    <option value="Garbage">Garbage Overflow</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.category && <span className="text-error text-sm">Category is required</span>}
                            </div>

                            {/* Location */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">Location Type</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Near City Park Entrance"
                                    className="input input-bordered w-full"
                                    {...register("location", { required: true })}
                                />
                                <label className="label">
                                    <span className="label-text-alt">You can describe the location or address.</span>
                                </label>
                            </div>

                            {/* Description */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">Description</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    placeholder="Describe the issue in detail..."
                                    {...register("description", { required: true })}
                                ></textarea>
                                {errors.description && <span className="text-error text-sm">Description is required</span>}
                            </div>

                            {/* Image Upload */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">Upload Photo</span>
                                </label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-base-200 hover:bg-base-300 border-gray-400">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <FaCloudUploadAlt className="w-8 h-8 mb-2 text-gray-500" />
                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            {...register("image")}
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                                {preview && (
                                    <div className="mt-4">
                                        <img src={preview} alt="Preview" className="h-48 w-full object-cover rounded-lg" />
                                    </div>
                                )}
                            </div>

                            <div className="card-actions justify-end mt-4">
                                <button className="btn btn-primary w-full md:w-auto">Submit Report</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportIssue;
