import React from 'react';
import { useSelector } from "react-redux";


// handleClose - function to close the modal
// jobID - id of the job which is currently last
// currentJobs - current jobs array
// updateJobs - function to update the allJobs array state in parent component (Results.jsx)
const DeleteJobModal = ({ handleClose, jobID, currentJobs, updateJobs }) => {

    const { token } = useSelector((state) => state.auth);

    const handleDelete = async () => {
        console.log("Deleting job with ID:", jobID);
        try {
            // Delete the selected Job
            const response = await fetch(`http://localhost:8000/delete_manual_job/${jobID}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              }
            });
      
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Failed to delete job: ${response.statusText}`);
            }
      
            const data = await response.json();
            console.log("Job deleted from backend:", data);
        }
        catch (error) {
            console.error("Error deleting job:", error);
        }

        const updatedJobs = currentJobs.filter(job => job.link_no !== jobID);
        updateJobs(updatedJobs); // Update the jobs in the parent component
        handleClose(); // Close the modal after deletion
    };

    return (
        <div className="text-black fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-96">
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={handleClose}
                    >
                        &times;
                    </button>
                </div>
                <div className="p-4">
                    <p>Are you sure you want to delete this job? This action cannot be undone.</p>
                </div>
                <div className="flex justify-end space-x-2 border-t p-4">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteJobModal;