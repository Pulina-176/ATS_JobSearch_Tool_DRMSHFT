import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { readJobTitles } from '../../utils/excelUtils';


const Modal = ({ modalState, isVisible, onClose, refresh }) => {

  const [visible, setVisible] = useState(false)

  const [inputValue, setInputValue] = useState(""); // For the input field
  const [jobTitles, setJobTitles] = useState([]); // For the autocomplete options
  const [filteredJobTitles, setFilteredJobTitles] = useState([]); // For the filtered options
  const autocompleteRef = useRef(null);
  const dispatch = useDispatch();
  const libraries = ["places"];

  useEffect(() => {
    const loadJobTitles = async () => {
      const titles = await readJobTitles();
      setJobTitles(titles);
    };
    loadJobTitles();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filtered = jobTitles.filter((title) =>
        title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredJobTitles(filtered);
    } else {
      setFilteredJobTitles([]);
    }
  };

  const handleSelectJobTitle = (title) => {
    setInputValue(title);
    setFilteredJobTitles([]);
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      setInputValue(place.formatted_address);
      refresh();
    }
  };

  // Sync `visible` state with `isVisible` prop on initial render
  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  // Close modal and notify parent
  const handleClose = () => {
    refresh();
    setVisible(false); // Update internal state
    if (onClose) {
      onClose(); // Notify parent
    }
  };


  const handleEnter = () => {
    dispatch(modalState.setter(
      inputValue
    ))
    setInputValue("");
    refresh();
  }

  if (!isVisible) return null; // Don't render if the modal is not visible

  return ReactDOM.createPortal(
    <div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="my_modal_3" className={`modal ${visible ? 'modal-open' : 'modal-close'}`}>
        <div className="modal-box w-full max-w-md mx-auto p-6">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>✕</button>
          </form>
          <h3 className="font-bold text-lg">Add {modalState.prop}</h3>
          <br className='h-[10px]'></br>
          {modalState.prop === 'Locations' ? (
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocompleteRef.current = autocomplete;
                }}
                onPlaceChanged={handlePlaceSelect}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Type a location..."
                />
              </Autocomplete>
            </LoadScript>
          ) : modalState.prop === 'Job Roles' ? (
            <div className='relative'>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-yellow-500 focus:border-yellow-500"                
                placeholder="Type Job Role..."
              />
              {filteredJobTitles.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1">
                  {filteredJobTitles.map((title, index) => (
                    <li
                      key={title}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectJobTitle(title)}
                    >
                      {title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="block w-3/5 border border-gray-700 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type here..."
            />
          )}
          <br></br>
          <div className='flex justify-center'>
          <button className='btn bg-yellow-500 text-white hover:bg-yellow-600' onClick={handleEnter}>Enter</button>
          </div>
        </div>
      </dialog>
    </div>,
    document.getElementById("modal-root") // Ensure this div is mounted to index.html
  );
};

export default Modal