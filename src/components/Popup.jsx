import React from 'react'

const Popup = (props) => {
  return (props.trigger) ? (
    <div id="popup" className='fixed z-50 left-0 top-28 w-[360px] bg-gray-500 flex justify-center items-center'>
        <div id="popup-inner" className='relative p-[8px] w-full'>
            <button id="close-btn" className='absolute hover:bg-blue-500 top-[8px] right-[10px] text-white' onClick={() => props.setTrigger(false)}>Close</button>
            {props.children}
        </div>
    </div>
  ) : "";
}

export default Popup