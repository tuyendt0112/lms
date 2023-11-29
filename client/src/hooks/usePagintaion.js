import { useMemo } from 'react'
import { generateRange } from 'ultils/helper'
import { BsThreeDots } from "react-icons/bs";

// useMemo => giúp tăng performance bằng cách chỉ lưu kết quả chứ không lưu nguyên hàm tính toán
const usePagintaion = (totalPitchCount, currentPage, siblingCount = 1) => {
    const paginationArray = useMemo(() => {
        const pageSize = process.env.REACT_APP_PITCH_LIMIT || 6
        const paginationCount = Math.ceil(totalPitchCount / pageSize)
        const totalPaginationItem = siblingCount + 5

        // [1,2,3,4,5,6]
        if (paginationCount <= totalPaginationItem) {
            // console.log("TH1: ", paginationCount)
            return generateRange(1, paginationCount)
        }

        // Hàm isShowLeft và isShowRight để tránh trường hợp thêm dấu ... vào giá trị trang đầu và giá trị trang cuối
        const isShowLeft = currentPage - siblingCount > 2
        // nếu current page = 3 thì trừ cho sibling là 1 thì page còn lại bên trái chỉ còn là 1 ==> không thể thêm dấu ... được
        // nếu current page = 4 thì trừ cho sibling là 1 thì page còn lại bên trái chỉ còn là 1 2 ==> thêm được dấu chấm ở vị trí 2
        const isShowRight = currentPage + siblingCount < paginationCount - 1
        // nếu current page = 6 thì + cho sibling là 1 thì page còn lại bên phải chỉ còn là 7 ==> ko thêm được dấu chấm ở vị trí 6

        // console.log(isShowRight)
        // [1,...,6,7,8,9,10]
        if (isShowLeft && !isShowRight) {
            const rightStart = paginationCount - 6 // Chọn số page muốn hiển thị ở bên phải DOT 
            const rightRange = generateRange(rightStart, paginationCount)
            // console.log("TH2 rightStart: ", rightStart)
            // console.log("TH2 rightRange: ", rightRange)
            return [1, <BsThreeDots />, ...rightRange]
        }

        // [1,2,3,4,5,...,10]
        if (!isShowLeft && isShowRight) {
            const leftRange = generateRange(1, 5) // Chọn số page muốn hiển thị ở bên trái DOT
            // console.log("TH3 leftRange: ", leftRange)
            return [...leftRange, <BsThreeDots />, paginationCount]
        }

        const siblingLeft = Math.max(currentPage - siblingCount, 1)
        const siblingRight = Math.min(currentPage + siblingCount, paginationCount)
        if (isShowLeft && isShowRight) {
            // console.log('siblingLeft', siblingLeft)
            // console.log('siblingRight', siblingRight)
            const middleRange = generateRange(siblingLeft, siblingRight)
            // console.log("TH4 middleRange: ", middleRange)
            return [1, <BsThreeDots />, ...middleRange, <BsThreeDots />, paginationCount]
        }

    }, [totalPitchCount, currentPage, siblingCount])

    return paginationArray
}

export default usePagintaion
{/*
first + last + current + sibling + 2*DOTS
min = 6 (sibling min = 1) => sibling + 5 
totalPagination : 66, limitProduct per page = 10 => number of page = 7
totalPaginationItem: sibling + 5 = 6 
sibling = 1
[1,2,3,4,5,6]
[1,...,6,7,8,9,10]
[1,2,3,4,5,...,10]
[1,...,5,6,7,...,10]
 */}