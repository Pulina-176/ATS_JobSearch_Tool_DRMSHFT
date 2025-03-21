// form to add a job manually
import React, { useState } from 'react'

// props passed:
// visible - modal is open or not
// closeModal - closeModal function is passed
// id - id of the job which is currently last
// setNextID - function to set the nextID state of parent component (Results.jsx)
// currentJobs - current jobs array
// updateJobs - function to update the allJobs array state in parent component (Results.jsx)
const AddJob = ({visible, closeModal, id, setNextID, currentJobs, updateJobs}) => {

    const [formData, setFormData] = useState({
        link_no: id,
        title: '',
        company: '',
        location: '',
        source: '',
        apply_link: '',
        full_description: '',
        other_info: ''
    })

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const newJob = formData;
        const newJobs = [...currentJobs, newJob];
        updateJobs(newJobs);
        setNextID(id + 1);
        closeModal();
    }

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
                        <button type='button' onClick={handleSubmit} className='p-2 bg-blue-500 text-white rounded'>Submit</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    )
}

export default AddJob