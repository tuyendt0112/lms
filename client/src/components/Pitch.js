import React from 'react'

const Pitch = ({ pitchData }) => {
    return (
        <div className='1/3'>
            <img src={pitchData?.images[0] || ''} alt="" className='w-full object-contain'></img>
        </div>
    )
}

export default Pitch