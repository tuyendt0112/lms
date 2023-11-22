import React, { memo, useState } from 'react'
import { pitchInforTabs } from '../ultils/constant'

const activedStyles = ''
const notActivedStyles = ''

const PitchInformation = () => {
    const [activedTab, setactivedTab] = useState(1)
    return (
        <div>
            <div className='flex items-center gap-2 relative bottom-[-1px]'>
                {pitchInforTabs.map(el => (
                    <span
                        className={`py-2 px-4 cursor-pointer ${activedTab === +el.id ? 'bg-white border border-b-0' : 'bg-gray-200'} `}
                        key={el.id}
                        onClick={() => setactivedTab(el.id)}
                    >
                        {el.name}
                    </span>
                ))}
            </div>
            <div className='w-full border'>
                {pitchInforTabs.some(el => el.id === activedTab) && pitchInforTabs.find(el => el.id === activedTab)?.content}
            </div>
        </div>
    )
}

export default memo(PitchInformation)