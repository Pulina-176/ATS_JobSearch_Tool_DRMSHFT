import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'


const Processing = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
      <div className="flex flex-col items-center text-white font-inter">
        <FontAwesomeIcon icon={faGear} spin className="text-[100px] mb-8" />
        <p className="text-lg">The search process may consume some time...</p>
        <p className="text-lg">Please stay tuned for the results</p>
      </div>
    </div>
  )
}

export default Processing

