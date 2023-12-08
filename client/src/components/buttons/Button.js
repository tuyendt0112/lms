import React, { memo } from 'react'

const Button = ({ name, handleOnClick, style, iconsBefore, iconAfter, fw, children, type = 'button' }) => {
    return (
        <button
            type={type}
            className={style ? style : `text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-lg shadow-indigo-800/100 hover:shadow-indigo-700/80 rounded-md text-sm px-5 py-2.5 text-center me-2 mb-2 ${fw ? 'w-full' : 'w-fit'}`}
            onClick={() => { handleOnClick && handleOnClick() }}
        >
            {/* {iconsBefore}
            <span>{name}</span>
            {iconAfter} */}
            {children}
        </button>
    )
}

export default memo(Button)