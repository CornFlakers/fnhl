import React from 'react'

const Popup = (props) => {
  return (props.trigger) ? (
    <div id="popup" className='fixed z-50 left-0 top-28 w-full bg-gray-500 flex justify-center items-center overflow-y-scroll'>
        <div id="popup-inner" className='relative left-0 top-0'>
            <button id="close-btn" className='absolute hover:bg-blue-500 top-1 right-[10px] text-white' onClick={() => props.setTrigger(false)}>Close</button>
            {props.children}
        </div>
    </div>
  ) : "";
}

export default Popup