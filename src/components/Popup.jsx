import React from 'react'

const Popup = (props) => {
  return (props.trigger) ? (
    <div id="popup" className='pointer-events-auto fixed z-50 top-28 left-2 right-2 bg-gray-500 flex justify-center items-center'>
        <div id="popup-inner" className='pointer-events-auto relative p-[8px] w-full max-w-xl'>
            <button id="close-btn" className='absolute hover:bg-blue-500 top-[8px] right-[10px] text-white' onClick={() => props.setTrigger(false)}>Close</button>
            {props.children}
        </div>
    </div>
  ) : "";
}

export default Popup