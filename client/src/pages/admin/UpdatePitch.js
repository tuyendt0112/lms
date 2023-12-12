import React, { useCallback, useEffect, useState, memo } from 'react'
import { Button, InputForm, MarkDownEditor, Select, Loading } from 'components'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { validate, getBase64 } from 'ultils/helper'
import { toast } from 'react-toastify'
import { apiUpdatePitch } from 'apis'
import { showModal } from 'store/app/appSilice'


const UpdatePitch = ({ editPitch, render, setEditPitch }) => {
    const dispath = useDispatch()
    const { categories } = useSelector(state => state.app)
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()

    const handleUpdatePitch = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            if (data.category) data.category = categories?.find(el => el.title === data.category)?.title
            const finalPayload = { ...data, ...payload }
            finalPayload.thumb = data?.thumb?.length === 0 ? preview.thumb : data.thumb[0]
            const formData = new FormData()
            for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
            finalPayload.images = data.images?.length === 0 ? preview.images : data.images
            for (let image of finalPayload.images) formData.append('images', image)
            dispath(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            window.scrollTo(0, 0)
            const response = await apiUpdatePitch(formData, editPitch._id)
            dispath(showModal({ isShowModal: false, modalChildren: null }))
            if (response.success) {
                toast.success(response.mes)
                render()
                setEditPitch(null)
            } else toast.error(response.mes)
        }
    }
    const [payload, setPayload] = useState({
        description: ''
    })
    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })

    const [invalidFields, setInvalidFields] = useState([])
    const changeValue = useCallback((e) => {
        setPayload(e)
    }, [payload])

    const handlePreviewThumb = async (file) => {
        const base64Thumb = await getBase64(file)
        setPreview(prev => ({ ...prev, thumb: base64Thumb }))
    }

    const handlePreviewImages = async (files) => {
        const imagesPreview = []
        for (let file of files) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                toast.warning('File type not correct')
                return
            }
            const base64 = await getBase64(file)
            imagesPreview.push(base64)
        }
        setPreview(prev => ({ ...prev, images: imagesPreview }))
    }

    useEffect(() => {
        if (watch('thumb') instanceof FileList && watch('thumb').length > 0) {
            handlePreviewThumb(watch('thumb')[0])
        }
    }, [watch('thumb')])

    useEffect(() => {
        if (watch('images') instanceof FileList && watch('images').length > 0) {
            handlePreviewImages(watch('images'))
        }
    }, [watch('images')])

    useEffect(() => {

        reset({
            title: editPitch?.title || '',
            price: editPitch?.price || '',
            address: editPitch?.address || '',
            category: editPitch?.category || '',
            brand: editPitch?.brand || '',
        })
        setPayload({
            description: typeof editPitch?.description === 'object'
                ? editPitch?.description?.join(', ')
                : editPitch?.description
        });

        setPreview({
            ...preview,
            thumb: editPitch?.thumb,
            images: editPitch?.images
        })

    }, [editPitch])
    return (
        <div className='w-full flex flex-col gap-4 px-4 relative'>
            <div className='p-4 border-b  bg-gray-100 flex justify-between items-center  top-0 left-[327px] right-0'>
                <h1 className='text-3xl font-bold tracking-tight'>Update Pitch</h1>
                <span className='text-main hover:underline cursor-pointer' onClick={() => setEditPitch(null)}>Cancle</span>
            </div>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleUpdatePitch)}>
                    <div className='w-full pt-5 pb-10'>
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
                    </div>
                    <div className='w-full pt-5 pb-10 flex gap-4'>
                        <InputForm
                            label='Price pitch'
                            register={register}
                            errors={errors}
                            id='price'
                            validate={{
                                required: 'Need to be fill'
                            }}
                            style='flex-1'
                            placeholder='Price of new pitch'
                            type='number'
                        />
                        <Select
                            label='Category'
                            options={categories?.map(el => ({ code: el.title, value: el.title }))}
                            register={register}
                            id='category'
                            validate={{ required: 'Nedd to be fill' }}
                            style='flex-1'
                            errors={errors}
                        />
                    </div>
                    <div className='w-full pt-5 pb-10 flex gap-4'>
                        <InputForm
                            label='Address'
                            register={register}
                            errors={errors}
                            id='address'
                            validate={{
                                required: 'Need to be fill'
                            }}
                            style='flex-1'
                            placeholder='Address of new pitch'
                        />
                    </div>
                    <div className='w-full pt-5 '>
                        <MarkDownEditor
                            name='description'
                            changeValue={changeValue}
                            label='Description'
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            value={payload.description}
                        />
                    </div>
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
                    <div className='flex flex-col gap-2 mt-8'>
                        <label className='font-semibold' htmlFor="pitches">Upload Image Of Pitch</label>
                        <input
                            type='file'
                            id='pitches'
                            {...register('images')}
                            multiple
                        />
                        {errors['images'] && <small className='text-sx text-red-500'>{errors['images']?.message}</small>}
                    </div>
                    {
                        preview?.images?.length > 0 &&
                        <div className='my-4 flex w-full gap-3 flex-wrap'>
                            {preview?.images?.map((el) => (
                                <div
                                    key={el.name}
                                    className='w-fit relative'>
                                    <img src={el} alt='thumbnail' className='w-[200px] object-contain' />
                                </div>
                            ))}
                        </div>
                    }
                    <div className='my-8'>
                        <Button type='submit'>Update new pitch</Button>
                    </div>
                </form>
            </div >
        </div>
    )
}

export default memo(UpdatePitch)