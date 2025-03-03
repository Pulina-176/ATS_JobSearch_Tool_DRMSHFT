import React from 'react'

const ATS = (ATS_keywords_dict) => {
  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-gray-500 p-4'>

        <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl'>
            <h1 className='text-2xl font-bold mb-6 text-center text-black'>ATS Keyword Report</h1>

            <div className='overflow-x-auto'>
                <p className='my-4 text-xl font-bold text-black'>Job Title</p>
                <table className='min-w-full bg-white border-black border-2'>
                        <tr>
                            <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Job Title</th>
                            <td className='py-3 px-4 border-b text-left text-md 
                                           font-semibold text-black'>
                                Text, djklsdj, jdlksjdks
                            </td>
                        </tr>
                        <tr>
                            <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Area of Expertise</th>
                        </tr>
                        <tr>
                            <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Soft Skills</th>
                        </tr>
                        <tr>
                            <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Technical Skills</th>
                        </tr>
                        <tr>
                            <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Action verbs</th>
                        </tr>
                        <tr>
                            <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Qualifications</th>
                        </tr>
                </table>
            </div>
        </div>
        
    </div>
  )
}

export default ATS