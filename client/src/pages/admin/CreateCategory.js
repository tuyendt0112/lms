import React, { useCallback, useEffect, useState } from 'react'
import { Button, InputForm, MarkDownEditor, Select, Loading } from 'components'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { validate, getBase64 } from 'ultils/helper'
import { toast } from 'react-toastify'
import { apiCreateCategory } from 'apis'
import { showModal } from 'store/app/appSilice'

const CreateCategory = () => {
    const dispath = useDispatch()
    const { categories } = useSelector(state => state.app)
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()
    const handleCreatePitch = async (data) => {
        const formData = new FormData()
        for (let i of Object.entries(data)) {
            formData.append(i[0], i[1])
        }
        if (data?.thumb) {
            formData.append('thumb', data?.thumb[0])
        }
        dispath(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        const response = await apiCreateCategory(formData)
        dispath(showModal({ isShowModal: false, modalChildren: null }))
        if (response.success) {
            reset()
            setPreview({
                thumb: null,
            })
            toast.success(response.mes)
        }
        else {
            toast.error(response.mes)
        }

    }

    const [preview, setPreview] = useState({
        thumb: null,
    })

    const handlePreviewThumb = async (file) => {
        const base64Thumb = await getBase64(file)
        setPreview(prev => ({ ...prev, thumb: base64Thumb }))
    }

    useEffect(() => {
        if (watch('thumb'))
            handlePreviewThumb(watch('thumb')[0])
    }, [watch('thumb')])

    return (
        <div className='w-full'>
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
                <span>Create Category</span>
            </h1>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleCreatePitch)}>
                    <div className='w-full my-6 flex gap-4'>
                        <InputForm
                            label='Name category'
                            register={register}
                            errors={errors}
                            id='title'
                            validate={{
                                required: 'Need to be fill'
                            }}
                            fullWidth
                            style='flex-1'
                            placeholder='Name of new category'
                        />
                    </div>
                    <div className='flex flex-col gap-2 mt-10'>
                        <label className='font-semibold' htmlFor="thumb">Upload thumb</label>
                        <input
                            type='file'
                            id='thumb'
                            {...register('thumb', { required: 'Need Select' })}
                        />
                        {errors['thumb'] && <small className='text-sx text-red-500'>{errors['thumb']?.message}</small>}
                    </div>
                    {
                        preview.thumb &&
                        <div className='my-4'>
                            <img src={preview.thumb} alt='thumbnail' className='w-[200px] object-contain' />
                        </div>
                    }
                    <div className='my-8'>
                        <Button type='submit'>Create new category</Button>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default CreateCategory