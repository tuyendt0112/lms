import { Pitch } from 'components'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { apiGetWishlist } from 'apis'

const Wishlist = () => {
  const { current } = useSelector((state) => state.user)
  const [wishList, setwishList] = useState(null)
  const fetchWishList = async (id) => {
    const response = await apiGetWishlist(id)
    setwishList(response)
  }

  useEffect(() => {
    fetchWishList(current?._id)
  }, [])

  const rerender = useCallback(() => {

  }, [])
  return (
    <div className='w-full relative px-6'>
      <header className='text-3xl font-semibold py-4 border-b border-b-blue-200'>
        Personal Wishlist
      </header>
      <div className='w-[1192px] grid grid-cols-3 gap-4'>
        {wishList?.rs?.wishlist?.map((el) => (
          <div key={el._id}>
            <Pitch
              pid={el._id}
              pitchData={el}
              normal={true}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist