import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom'
import { Breadcrumb, Pitch, SearchItem, InputSelect, Pagination, InputForm } from 'components'
import { apiGetPitches } from 'apis'
import Masonry from 'react-masonry-css'
import { sorts } from 'ultils/constant'
import useDebounce from 'hooks/useDebounce'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const Pitches = () => {
  const navigate = useNavigate()
  const [pitches, setpitches] = useState(null)
  const [activeClick, setactiveClick] = useState(null)
  const [params] = useSearchParams()
  const [sort, setSort] = useState('')
  const { category } = useParams()
  const [searching, setSearching] = useState('')

  const fetchProductsByCategory = async (queries) => {
    if (category && category !== 'pitches') queries.category = category
    const response = await apiGetPitches(queries)
    if (response.success) setpitches(response)
  }

  useEffect(() => {
    const queries = Object.fromEntries([...params])
    let priceQuery = {}
    if (queries.to && queries.from) {
      priceQuery = {
        $and: [
          { price: { gte: queries.from } },
          { price: { lte: queries.to } }
        ]
      }
      delete queries.price
    } else {
      if (queries.from) queries.price = { gte: queries.from }
      if (queries.to) queries.price = { lte: queries.to }
    }
    delete queries.to
    delete queries.from
    const q = { ...priceQuery, ...queries }
    fetchProductsByCategory(q)
    window.scrollTo(0, 0)
  }, [params])

  const changeActiveFilter = useCallback((name) => {
    if (activeClick === name) setactiveClick(null)
    else setactiveClick(name)
  }, [activeClick])

  const changeValue = useCallback((value) => {
    setSort(value)
  }, [sort])

  useEffect(() => {
    const queries = Object.fromEntries([...params])
    delete queries?.sort
    if (sort) {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({ sort, ...queries }).toString()
      })
    }
  }, [sort])

  useEffect(() => {
    const queries = Object.fromEntries([...params])

    delete queries?.q
    if (searching) {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({ q: searching, ...queries }).toString()
      })
    }
    else {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({ ...queries }).toString()
      })
    }
  }, [searching, params])

  //   useEffect(() => {
  //     if (queryDecounce) {
  //         navigate({
  //             pathname: location.pathname,
  //             search: createSearchParams({ q: queryDecounce }).toString()
  //         })
  //     } else {
  //         navigate({
  //             pathname: location.pathname,
  //         })
  //     }
  // }, [queryDecounce])

  return (
    <div className='w-full'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main'>
          <h3 className='font-semibold uppercase'>{category}</h3>
          <Breadcrumb category={category}></Breadcrumb>
        </div>
      </div>
      <div className='w-main border p-4 flex justify-between mt-8 m-auto gap-3'>
        <div className='w-3/5 flex-auto flex flex-col gap-3'>
          <span className='font-semibold text-sm'>Filter by</span>
          <div className="flex items-center gap-4">
            <SearchItem
              name="Price"
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
              type="input"
            ></SearchItem>
            <SearchItem
              name="Address"
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
            ></SearchItem>
          </div>
        </div>
        <div className='w-1/5 flex flex-col gap-3'>
          <span className='font-semibold text-sm'>Search</span>
          <input
            onChange={(e) => setSearching(e.target.value)}
            type='type'
            value={searching}
            id='q'
            className='form-input my-auto rounded-md w-full text-sm mb-2'
          />
        </div>
        <div className='w-1/5 flex flex-col gap-3'>
          <span className='font-semibold text-sm'>Sort by</span>
          <div className='w-full'>
            <InputSelect changeValue={changeValue} value={sort} options={sorts}></InputSelect>
          </div>
        </div>
      </div>
      <div className='mt-8 w-main m-auto'>
        <Masonry
          breakpointCols={3}
          className="my-masonry-grid flex mx-[-10px] pl-3"
          columnClassName="my-masonry-grid_column">
          {pitches?.pitches?.map(el => (
            <Pitch
              key={el._id}
              pid={el._id}
              pitchData={el}
              normal={true}
            >
            </Pitch>
          ))}
        </Masonry>
      </div>
      <div className='w-main m-auto my-4 flex justify-end'>
        <Pagination totalCount={pitches?.totalCount} />
      </div>
      <div className='w-full h-[500px]'></div>
    </div>
  )
}

export default Pitches