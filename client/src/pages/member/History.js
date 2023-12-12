import React, { useCallback, useEffect, useState } from 'react'
import { InputForm, Pagination } from 'components'
import { useForm } from 'react-hook-form'
import { apiDeletePitch, apiGetUserOrder } from 'apis'
import moment from 'moment'
import icons from 'ultils/icons'
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import useDebounce from 'hooks/useDebounce'
import UpdatePitch from 'pages/admin/UpdatePitch'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const { AiFillStar } = icons

const History = () => {
  const { current } = useSelector((state) => state.user);
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { register, formState: { errors }, watch } = useForm()
  const [pitches, setPitches] = useState(null)
  const [counts, setCounts] = useState(0)
  const [editPitch, setEditPitch] = useState(null)
  const [update, setUpdate] = useState(false)

  const render = useCallback(() => {
    setUpdate(!update)
  })
  const fetchPitches = async (params) => {
    const response = await apiGetUserOrder(current._id)
    if (response.success) {
      setPitches(response.Booking)
      setCounts(response.Booking.length)
    }
  }

  const queryDecounce = useDebounce(watch('q'), 800)
  // const queryDecounce = useDebounce(queries.q, 500)

  useEffect(() => {
    if (queryDecounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ q: queryDecounce }).toString()
      })
    } else {
      navigate({
        pathname: location.pathname,
      })
    }
  }, [queryDecounce])

  useEffect(() => {
    const searchParams = Object.fromEntries([...params])
    fetchPitches(searchParams)
  }, [params, update])

  const handleDeletePitch = (pid) => {
    Swal.fire({
      title: 'Are you sure',
      text: 'Sure friends ?',
      icon: 'warning',
      showCancelButton: true
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeletePitch(pid)
        if (response.success) toast.success(response.mes)
        else toast.error(response.mes)
        render()
      }

    })
  }
  console.log(pitches)
  return (
    <div className='w-full flex flex-col gap-4 px-4 relative'>
      {editPitch &&
        <div className='absolute inset-0 win-h-screen bg-gray-100 z-50'>
          <UpdatePitch
            editPitch={editPitch}
            render={render}
            setEditPitch={setEditPitch}
          />
        </div>
      }
      <div className='p-4 border-b w-full  flex justify-between items-center '>
        <h1 className='text-3xl font-bold tracking-tight'>History</h1>
      </div>
      <div className='flex w-full justify-end items-center px-1'>
        {/* <form className='w-[45%]' onSubmit={handleSubmit(handleManagePitch)}> */}
        <form className='w-[45%]' >
          <InputForm
            id='q'
            register={register}
            errors={errors}
            fullWidth
            placeholder='Search products by title, description ...' />
        </form>
      </div>
      <table className='table-auto w-full '>
        <thead className='text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr className='bg-sky-900 text-white  py-2'>
            <th className='px-4 py-2 text-center h-[60px] rounded-tl-lg'>#</th>
            <th className='px-4 py-2 text-center h-[60px] '>Title</th>
            <th className='px-4 py-2 text-center h-[60px] '>Total Price</th>
            <th className='px-4 py-2 text-center h-[60px] '>CreateAt</th>
            <th className='px-4 py-2 text-center h-[60px] '>Status</th>
          </tr>
        </thead>
        <tbody>
          {
            pitches?.map((el, index) => (
              <tr className='odd:bg-white odd:dark:bg-gray-300 even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700"' key={el._id}>
                <td className='text-center px-6 py-5 '>
                  {((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_PITCH_LIMIT) + index + 1}
                </td>
                <td className='text-center py-2'>{el.pitch.title}</td>
                <td className='text-center py-2'>{el.pitch.price}</td>
                <td className='text-center py-2'>{moment(el.bookedDate).format('DD/MM/YYYY')}</td>
                <td className='text-center py-2'>{el.status}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className='w-full flex justify-end my-8'>
        <Pagination totalCount={counts} type='orders' />
      </div>
    </div>
  )
}


export default History