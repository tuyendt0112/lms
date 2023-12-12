import React, { useEffect, useState, memo } from 'react'
import { Button, InputForm, Loading } from 'components'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { getBase64 } from 'ultils/helper'
import { toast } from 'react-toastify'
import { apiUpdateCategory } from 'apis'
import { showModal } from 'store/app/appSilice'

const UpdateCategory = ({ editPitch, render, setEditPitch }) => {
    const dispath = useDispatch()
    const { categories } = useSelector(state => state.app)
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()

    const handleUpdatePitch = async (data) => {
        const finalPayload = { ...data }
        finalPayload.thumb = data?.thumb?.length === 0 ? preview.thumb : data.thumb[0]
        const formData = new FormData()
        for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
        dispath(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        const response = await apiUpdateCategory(formData, editPitch._id)
        dispath(showModal({ isShowModal: false, modalChildren: null }))
        if (response.success) {
            toast.success(response.mes)
            render()
            setEditPitch(null)
        } else toast.error(response.mes)
    }
    const [preview, setPreview] = useState({
        thumb: null,
    })

    const handlePreviewThumb = async (file) => {
        const base64Thumb = await getBase64(file)
        setPreview(prev => ({ ...prev, thumb: base64Thumb }))
    }


    useEffect(() => {
        if (watch('thumb') instanceof FileList && watch('thumb').length > 0) {
            handlePreviewThumb(watch('thumb')[0])
        }
    }, [watch('thumb')])

    useEffect(() => {
        reset({
            title: editPitch?.title || '',
        })
        setPreview({
            ...preview,
            thumb: editPitch?.thumb,
        })
    }, [editPitch])
    return (
        <div className='w-full flex flex-col gap-4 px-4 relative'>
            <div className='p-4 border-b  bg-gray-100 flex justify-between items-center  top-0 left-[327px] right-0'>
                <h1 className='text-3xl font-bold tracking-tight'>Update Category</h1>
                <span className='text-main hover:underline cursor-pointer' onClick={() => setEditPitch(null)}>Cancle</span>
            </div>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleUpdatePitch)}>
                    <InputForm
                        label='Name pitch'
                        register={register}
                        errors={errors}
                        id='title'
                        validate={{
                            required: 'Need to be fill'
                        }}
                        fullWidth
                        placeholder='Name of new pitch'
                    />
                    <div className='flex flex-col gap-2 mt-8'>
                        <label className='font-semibold' htmlFor="thumb">Upload thumb</label>
                        <input
                            type='file'
                            id='thumb'
                            {...register('thumb')}
                        />
                        {errors['thumb'] && <small className='text-sx text-red-500'>{errors['thumb']?.message}</small>}
                    </div>
                    {
                        preview?.thumb &&
                        <div className='my-4'>
                            <img src={preview.thumb} alt='thumbnail' className='w-[200px] object-contain' />
                        </div>
                    }
                    <div className='my-8'>
                        <Button type='submit'>Update category</Button>
                    </div>
                </form>
            </div >
        </div>
    )
}


export default memo(UpdateCategory)