import React, { memo } from 'react'
import { HashLoader } from 'react-spinners'

const Loading = () => {
    return (
        <HashLoader color='#062f5f' />
    )
}

export default memo(Loading)