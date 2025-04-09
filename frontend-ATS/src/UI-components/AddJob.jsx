// form to add a job manually
import React, { useState } from 'react'
import { useSelector } from "react-redux";

// props passed:
// visible - modal is open or not
// closeModal - closeModal function is passed
// id - id of the job which is currently last
// setNextID - function to set the nextID state of parent component (Results.jsx)
// currentJobs - current jobs array
// updateJobs - function to update the allJobs array state in parent component (Results.jsx)
const AddJob = ({visible, closeModal, id, setNextID, currentJobs, updateJobs}) => {

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // backend URL from .env file

    const [formData, setFormData] = useState({ // initial state of the form
        link_no: 0,
        title: '',
        company: '',
        location: '',
        source: '',
        apply_link: '',
        full_description: '',
        other_info: ''
    })

    const { token } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newJob = formData;

        newJob = {
            ...formData,
            link_no: id, // ensure updated value here
          };

        console.log("Request body being sent:", JSON.stringify(newJob));

        try {
            // Send the manual job to the backend
            const response = await fetch(`${BACKEND_URL}/add_manual_job`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify(newJob),
            });
      
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Failed to add manual job: ${response.statusText}`);
            }
      
            const data = await response.json();
            console.log("Manual job added to backend:", data);

        const newJobs = [...currentJobs, newJob];
        updateJobs(newJobs);
        setNextID(id + 1);
        closeModal();
    }catch (error) {
      console.error("Error adding manual job:", error);
    }
  };

    return (
        <div>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="add_job_form" className={`modal ${visible ? 'modal-open' : 'modal-close'}`}>
                {visible && <div className='modal-overlay fixed inset-0 bg-white opacity-60' onClick={closeModal}></div>}
                <div className='modal-box'>
                    <h2 className='text-lg font-bold mb-4'>Add Job</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                        <label className='block text-sm font-medium text-white'>Title</label>
                        <input
                            type='text'
                            name='title'
                            value={formData.title}
                            onChange={handleChange}
                            className='mt-1 block w-full p-2 border border-gray-300 rounded'
                            required
                        />
                        </div>
                        <div className='mb-4'>
                        <label className='block text-sm font-medium text-white'>Company</label>
                        <input
                            type='text'
                            name='company'
                            value={formData.company}
                            onChange={handleChange}
                            className='mt-1 block w-full p-2 border border-gray-300 rounded'
                            required
                        />
                        </div>
                        <div className='mb-4'>
                        <label className='block text-sm font-medium text-white'>Location</label>
                        <input
                            type='text'
                            name='location'
                            value={formData.location}
                            onChange={handleChange}
                            className='mt-1 block w-full p-2 border border-gray-300 rounded'
                            required
                        />
                        </div>
                        <div className='mb-4'>
                        <label className='block text-sm font-medium text-white'>Source</label>
                        <input
                            type='text'
                            name='source'
                            value={formData.source}
                            onChange={handleChange}
                            className='mt-1 block w-full p-2 border border-gray-300 rounded'
                            required
                        />
                        </div>
                        <div className='mb-4'>
                        <label className='block text-sm font-medium text-white'>Apply Link</label>
                        <input
                            type='text'
                            name='apply_link'
                            value={formData.apply_link}
                            onChange={handleChange}
                            className='mt-1 block w-full p-2 border border-gray-300 rounded'
                            required
                        />
                        </div>
                        <div className='mb-4'>
                        <label className='block text-sm font-medium text-white'>Full Description</label>
                        <textarea
                            name='full_description'
                            value={formData.full_description}
                            onChange={handleChange}
                            className='mt-1 block w-full p-2 border border-gray-300 rounded'
                            rows='4'
                            required
                        />
                        </div>
                        <div className='flex justify-end'>
                        <button type='button' onClick={closeModal} className='mr-2 p-2 bg-gray-500 text-white rounded'>Cancel</button>
                        <button type='submit' onClick={handleSubmit} className='p-2 bg-blue-500 text-white rounded'>Submit</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    )
}

export default AddJob