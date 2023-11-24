import React, { memo, useState } from 'react'
import { pitchInforTabs } from '../ultils/constant'
import { Votebar } from './'
import { renderStarFromNumber } from '../ultils/helper'

const activedStyles = ''
const notActivedStyles = ''

const PitchInformation = ({ totalRatings, totalCount }) => {
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
                <span
                    className={`py-2 px-4 cursor-pointer ${activedTab === 5 ? 'bg-white border border-b-0' : 'bg-gray-200'} `}
                    onClick={() => setactivedTab(5)}
                >
                    CUSTOMER REVIEW
                </span>
            </div>
            <div className='w-full border p-4'>
                {pitchInforTabs.some(el => el.id === activedTab) && pitchInforTabs.find(el => el.id === activedTab)?.content}
                {activedTab === 5 && <div className='flex p-4'>
                    <div className='flex-4 border flex-col flex items-center justify-center border-red-500'>
                        <span className='font-semibold text-3xl'>{`${totalRatings}/5`}</span>
                        <span className='flex items-center gap-1'>{renderStarFromNumber(totalRatings)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}</span>
                        <span className='text-sm'>{`${totalCount} reviewers and commentors`}</span>
                    </div>
                    <div className='flex-6 border flex gap-2 flex-col p-4'>
                        {Array.from(Array(5).keys()).reverse().map(el => (
                            <Votebar
                                key={el}
                                number={el + 1}
                                ratingTotal={5}
                                ratingCount={2}
                            ></Votebar>
                        ))}
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default memo(PitchInformation)