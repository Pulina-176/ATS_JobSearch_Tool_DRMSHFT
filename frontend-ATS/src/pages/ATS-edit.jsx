import React, { useState , useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import CustomLoading from '../UI-components/CustomLoading'

// convert from array time keywords to string when loading
// when saving save back for array type keyword

const ATS_Edit = () => {

    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate();

    // get the data from previous page (ATS Preview)
    const location = useLocation();
    const ATSdata = location.state?.ATSdata || []; // Get the data from navigation state

    // convert from array type keywords list to one string type when loading
    function convertKeywordsToString(set) {
        const arrayLength = set.length;

        for (var i = 0; i < arrayLength; i++) {
            set[i].keywords["Job title"] = set[i].keywords["Job title"].join(', ');
            set[i].keywords["Soft Skills"] = set[i].keywords["Soft Skills"].join(', ');
            set[i].keywords["Technical Skills"] = set[i].keywords["Technical Skills"].join(', ');
            set[i].keywords["Action Verbs"] = set[i].keywords["Action Verbs"].join(', ');
            set[i].keywords["Qualifications"] = set[i].keywords["Qualifications"].join(', ');
            set[i].keywords["Areas of Expertise"] = set[i].keywords["Areas of Expertise"].join(', ');
        }
    }

    // convert from string type keywords list to the initial array type when saving
    function convertStringtoKeywords(set) {
        const arrayLength = set.length;

        for (var i = 0; i < arrayLength; i++) {
            set[i].keywords["Job title"] = set[i].keywords["Job title"].split(', ');
            set[i].keywords["Soft Skills"] = set[i].keywords["Soft Skills"].split(', ');
            set[i].keywords["Technical Skills"] = set[i].keywords["Technical Skills"].split(', ');
            set[i].keywords["Action Verbs"] = set[i].keywords["Action Verbs"].split(', ');
            set[i].keywords["Qualifications"] = set[i].keywords["Qualifications"].split(', ');
            set[i].keywords["Areas of Expertise"] = set[i].keywords["Areas of Expertise"].split(', ');
        }
    }

    // state to store the keyword sets for editing period. Constantly update when changes are made
    const [keyWordSets, setKeyWordSets] = useState([])

    // Initial render
    useEffect(() => {
        convertKeywordsToString(ATSdata)
        setKeyWordSets(ATSdata)
        setIsLoading(false)
    }, [])

    // function to handle changes in the input fields
    function handleInputChange(index, category, value) {
        let newKeyWordSets = [...keyWordSets];
        newKeyWordSets[index].keywords[category] = value;
        setKeyWordSets(newKeyWordSets);
    }

    function confirmChanges() {
        convertStringtoKeywords(keyWordSets)
        navigate('/ats-preview', { state: { ATSdata: keyWordSets } })        
    }

    if (isLoading) {
        return <CustomLoading message1={"Loading"} message2={"Please wait"}/>
    }

    return (
        <div className='flex flex-col justify-center items-center min-h-screen bg-gray-500 p-4'>

            <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl'>
                <h1 className='text-2xl font-bold mb-6 text-center text-black'>ATS Keyword Report</h1>
                <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded' onClick={confirmChanges}>Confirm Changes</button>

                {keyWordSets.map((Set, index) => (
                    <div className='overflow-x-auto' key={index}>
                        <p className='my-4 text-xl font-bold text-black'>{Set.title}</p>
                        <table className='min-w-full bg-white border-black border-2'>
                            <tbody>
                                <tr>
                                    <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Job Titles</th>
                                    <td className='py-3 px-4 border-b text-left text-md 
                                                   font-semibold text-black h-full w-[80%]'>
                                        <textarea className='bg-transparent resize-none w-full h-full' 
                                               value={Set.keywords["Job title"]}
                                               onChange={(e) => handleInputChange(index, "Job title", e.target.value)}
                                               rows={3}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Areas of Expertise</th>
                                    <td className='py-3 px-4 border-b text-left text-md 
                                                   font-semibold text-black'>
                                        <textarea className='bg-transparent resize-none w-full h-full' 
                                               value={Set.keywords["Areas of Expertise"]}
                                               onChange={(e) => handleInputChange(index, "Areas of Expertise", e.target.value)}
                                               rows={3}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Soft Skills</th>
                                    <td className='py-3 px-4 border-b text-left text-md 
                                                   font-semibold text-black'>
                                        <textarea className='bg-transparent resize-none w-full h-full' 
                                               value={Set.keywords["Soft Skills"]}
                                               onChange={(e) => handleInputChange(index, "Soft Skills", e.target.value)}
                                               rows={3}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Technical Skills</th>
                                    <td className='py-3 px-4 border-b text-left text-md 
                                                   font-semibold text-black'>
                                        <textarea className='bg-transparent resize-none w-full h-full' 
                                               value={Set.keywords["Soft Skills"]}
                                               onChange={(e) => handleInputChange(index, "Soft Skills", e.target.value)}
                                               rows={3}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Action verbs</th>
                                    <td className='py-3 px-4 border-b text-left text-md 
                                                   font-semibold text-black'>
                                        <textarea className='bg-transparent resize-none w-full h-full' 
                                               value={Set.keywords["Action Verbs"]}
                                               onChange={(e) => handleInputChange(index, "Action Verbs", e.target.value)}
                                               rows={3}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className='py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Qualifications</th>
                                    <td className='py-3 px-4 border-b text-left text-md 
                                                   font-semibold text-black'>
                                        <textarea className='bg-transparent resize-none w-full h-full' 
                                               value={Set.keywords["Qualifications"]}
                                               onChange={(e) => handleInputChange(index, "Qualifications", e.target.value)}
                                               rows={3}
                                        />
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

export default ATS_Edit