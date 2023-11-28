import React, { memo } from 'react'
import usePagintaion from 'hooks/usePagintaion'
import PagintaionItem from './PagintaionItem'
const Pagination = ({ totalCount }) => {
    const pagination = usePagintaion(66, 2)
    console.log(usePagintaion(66, 2, 1))
    return (
        <div className='flex items-center'>
            {pagination?.map(el => (
                <PagintaionItem key={el}>
                    {el}
                </PagintaionItem>
            ))}
        </div>
    )
}

export default memo(Pagination)
