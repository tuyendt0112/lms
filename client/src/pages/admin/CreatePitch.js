import React from 'react'
import { Button, InputForm, Select } from 'components'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
const CreatePitch = () => {
    const { categories } = useSelector(state => state.app)
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()
    const handleCreatePitch = (data) => {
        if (data.category) {
            data.category = categories?.find(el => el._id === data.category)?.title
            console.log(data.category)
            console.log(data)
        }
    }
    // console.log(watch('category'))
    return (
        <div className='w-full'>
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
                <span>Create Pitch</span>
            </h1>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleCreatePitch)}>
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
                    <div className='w-full my-6 flex gap-4'>
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
                        {/* <InputForm
                            label='Name pitch'
                            register={register}
                            errors={errors}
                            id='title'
                            validate={{
                                required: 'Need to be fill'
                            }}
                            style='flex-1'
                            placeholder='Price of new pitch'
                        /> */}
                    </div>
                    <div className='w-full my-6 flex gap-4'>
                        <Select
                            label='Category'
                            options={categories?.map(el => ({ code: el._id, value: el.title }))}
                            register={register}
                            id='category'
                            validate={{ required: 'Nedd to be fill' }}
                            style='flex-1'
                            errors={errors}
                        />
                        <Select
                            label='Brand (Optional)'
                            options={categories?.find(el => el._id === watch('category'))?.brand?.map(el => ({ code: el, value: el }))}
                            register={register}
                            id='brand'
                            style='flex-1 max-h-[42px]'
                            errors={errors}
                        />
                    </div>
                    <Button type='submit'>Create new pitch</Button>
                </form>
            </div>
        </div>
    )
}

export default CreatePitch