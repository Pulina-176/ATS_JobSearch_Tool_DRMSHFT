import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';


const LoadingPdf = () => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
      <div className="flex flex-col items-center text-white font-inter p-6 rounded-lg">
        <FontAwesomeIcon icon={faGear} spin className="text-[100px] mb-8 text-white" />
        <p className="text-lg mb-2">This process may consume some time...</p>

      </div>
  </div>
  )
}

export default LoadingPdf;