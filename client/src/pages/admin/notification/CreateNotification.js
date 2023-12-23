import React, { useEffect, useState } from "react"
import { Button, InputForm, Loading } from "components"
import Select from "react-select"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { apiCreateNotification } from "apis"
import { showModal } from "store/app/appSilice"

const CreateNotification = () => {
    const dispatch = useDispatch()
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm()
    const handleCreateMajor = async (data) => {
        const finalPayload = {
            ...data,
        }
        const formData = new FormData()
        for (let i of Object.entries(finalPayload)) {
            formData.append(i[0], i[1])
        }

        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        window.scrollTo(0, 0)
        const response = await apiCreateNotification(finalPayload)
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
        if (response.success) {
            reset()
            toast.success(response.mes)
        } else {
            toast.error(response.mes)
        }
    }

    return (
        <div className="w-full flex flex-col gap-4 px-4 ">
            <div className="p-4 border-b w-full flex items-center ">
                <h1 className="text-3xl font-bold tracking-tight">Create Notification</h1>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleCreateMajor)}>
                    <div className="w-full py-5">
                        <InputForm
                            label="Notification Title"
                            register={register}
                            errors={errors}
                            id="title"
                            validate={{
                                required: "Require",
                            }}
                            fullWidth
                            placeholder="Name of Notification"
                        />
                    </div>
                    <div className="w-full pt-10 pb-5">
                        <InputForm
                            label="Notification content"
                            register={register}
                            errors={errors}
                            id="content"
                            validate={{
                                required: "Require",
                            }}
                            fullWidth
                            placeholder="Content"
                        />
                    </div>
                    <div className="w-full pt-10 pb-5">
                        <InputForm
                            label="File"
                            register={register}
                            errors={errors}
                            id="file"

                            fullWidth
                            placeholder="..."
                        />
                    </div>
                    <div className="my-8">
                        <Button type="submit">Create New Notification</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateNotification