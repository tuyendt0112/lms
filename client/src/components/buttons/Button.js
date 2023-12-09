import React, { memo } from 'react'

const Button = ({ name, handleOnClick, style, fw, children, type = 'button' }) => {
    return (
        <button
            type={type}
            className={style
                ? style
                : `text-white rounded-md text-sm px-5 py-2.5 text-center me-2 mb-2
                bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-lg
                shadow-indigo-800/100 hover:shadow-indigo-700/80 
                 ${fw ? 'w-full' : 'w-fit'}`}
            onClick={() => { handleOnClick && handleOnClick() }}
        >
            {children}
        </button>
    )
}

export default memo(Button)