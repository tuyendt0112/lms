import React, { memo } from 'react'
import usePagintaion from 'hooks/usePagintaion'
import { PagintaionItem } from 'components'
import { useSearchParams } from 'react-router-dom'
const Pagination = ({ totalCount }) => {
    const [params] = useSearchParams()
    const pagination = usePagintaion(totalCount, 1)
    const caculatePitch = () => {
        const currentPage = +params.get('page')
        const pageSize = +process.env.REACT_APP_PITCH_LIMIT || 6
        const start = ((currentPage - 1) * pageSize) + 1
        const end = Math.min(currentPage * pageSize, totalCount)
        if (start > 0 && end <= 0) {
            return '0 - 0'
        }
        else {
            return `${start} - ${end}`
        }
    }
    console.log(caculatePitch())
    return (
        <div className='flex w-main justify-between items-center'>
            {
                !+params.get('page') &&
                <span className='text-sm italic'>
                    {`Show pitchs 1 - ${+process.env.REACT_APP_PITCH_LIMIT || 6} of ${totalCount}`}
                </span>
            }
            {
                +params.get('page') &&
                <span className='text-sm italic'>
                    {`Show pitchs ${caculatePitch()} of ${totalCount}`}
                </span>
            }
            <div className='flex items-center'>
                {pagination?.map(el => (
                    <PagintaionItem key={el}>
                        {el}
                    </PagintaionItem>
                ))}
            </div>
        </div>
    )
}

export default memo(Pagination)
