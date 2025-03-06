import React from 'react'
import { useLocation , useNavigate } from 'react-router-dom'

const ATS = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const KeyWordSets = location.state?.ATSdata || []; // Get the data from navigation state
    console.log(KeyWordSets)


    return (
        <div className='flex flex-col justify-center items-center min-h-screen bg-gray-500 p-4'>

            <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl'>
                <h1 className='text-2xl font-bold mb-6 text-center text-black'>ATS Keyword Report</h1>
                <button className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded' onClick={() => navigate('/ats-edit', { state: { ATSdata:KeyWordSets} })}>Make Changes</button>

                {KeyWordSets.map((Set, index) => (
                    <div className='overflow-x-auto' key={index}>
                        <p className='my-4 text-xl font-bold text-black'>{Set.title}</p>
                        <table className='min-w-full bg-white border-black border-2'>
                            <tbody>
                                <tr>
                                    <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Job Titles</th>
                                    <td className='py-3 px-4 border-b text-left text-md 
                                                   font-semibold text-black'>
                                        {Set.keywords["Job title"].join(', ')}
                                    </td>
                                </tr>
                                <tr>
                                    <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Areas of Expertise</th>
                                    <td className='py-3 px-4 border-b text-left text-md 
                                                   font-semibold text-black'>
                                        {Set.keywords["Areas of Expertise"].join(', ')}
                                    </td>
                                </tr>
                                <tr>
                                    <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Soft Skills</th>
                                    <td className='py-3 px-4 border-b text-left text-md 
                                                   font-semibold text-black'>
                                        {Set.keywords["Soft Skills"].join(', ')}
                                    </td>
                                </tr>
                                <tr>
                                    <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Technical Skills</th>
                                    <td className='py-3 px-4 border-b text-left text-md 
                                                   font-semibold text-black'>
                                        {Set.keywords["Technical Skills"].join(', ')}
                                    </td>
                                </tr>
                                <tr>
                                    <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Action verbs</th>
                                    <td className='py-3 px-4 border-b text-left text-md 
                                                   font-semibold text-black'>
                                        {Set.keywords["Action Verbs"].join(', ')}
                                    </td>
                                </tr>
                                <tr>
                                    <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Qualifications</th>
                                    <td className='py-3 px-4 border-b text-left text-md 
                                                   font-semibold text-black'>
                                        {Set.keywords["Qualifications"].join(', ')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}

            </div>
            
        </div>
    )
}

export default ATS