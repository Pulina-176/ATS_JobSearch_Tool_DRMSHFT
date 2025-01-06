import React, { useState , useEffect } from 'react'
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";

const Modal = ({modalState, isVisible, onClose, refresh}) => {

  const [visible, setVisible] = useState(false)

  const [inputValue, setInputValue] = useState(""); // For the input field
  
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

  const dispatch = useDispatch();

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
        <div className="modal-box">
            <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>✕</button>
            </form>
            <h3 className="font-bold text-lg">Add {modalState.prop}</h3>
            <br className='h-[10px]'></br>
            <input
              id="input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="block w-3/5 border border-gray-700 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type something..."
            />
            <br></br>
            <button className='btn btn-md' onClick={handleEnter}>Enter</button>
        </div>
        </dialog>
    </div>,
    document.getElementById("modal-root") // Ensure this div is mounted to index.html
  )
}

export default Modal