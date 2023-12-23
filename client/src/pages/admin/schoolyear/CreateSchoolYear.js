import React, { useCallback, useEffect, useState } from "react"
import { Button, InputForm, MarkDownEditor, Loading } from "components"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { validate } from "ultils/helper"
import { toast } from "react-toastify"
import {
    apiCreateSchoolYear
} from "apis"
import { showModal } from "store/app/appSilice"
import Select from "react-select"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import icons from "ultils/icons"

const CreateSchoolYear = () => {
    const { FaCalendarAlt } = icons
    const dispatch = useDispatch()
    const [selectedDateEnd, setSelectedDateEnd] = useState(null)
    const [selectedDateStart, setSelectedDateStart] = useState(null)
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm()

    const handleCreateTopic = async (data) => {
        const finalPayload = {
            ...data,
            start: selectedDateStart,
            end: selectedDateEnd,
        }
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        window.scrollTo(0, 0)
        const response = await apiCreateSchoolYear(finalPayload)
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
        if (response.success) {
            reset()
            setSelectedDateStart(null)
            setSelectedDateEnd(null)
            toast.success("Create School Year Success !")
        } else {
            toast.error("Fail!!!")
        }

    }

    return (
        <div className="w-full flex flex-col gap-4 px-4 ">
            <div className="p-4 border-b w-full flex items-center ">
                <h1 className="text-3xl font-bold tracking-tight">Create School Year</h1>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleCreateTopic)}>
                    <div className="w-full py-5">
                        <InputForm
                            label="School year title"
                            register={register}
                            errors={errors}
                            id="title"
                            validate={{
                                required: "Need to be fill",
                            }}
                            fullWidth
                            style="flex-1"
                            placeholder="School year..."
                        />
                    </div>
                    <div className="w-full pt-5 pb-10">
                        <div className="w-full">
                            <div className="flex items-center pb-2">
                                <h2 className="font-semibold">Date Start</h2>
                                <FaCalendarAlt className="ml-2" />
                            </div>
                            <div className="w-full pb-5 gap-4">
                                <DatePicker
                                    selected={selectedDateStart}
                                    onChange={(date) => setSelectedDateStart(date)}
                                    dateFormat="MM/yyyy"
                                    minDate={new Date()}
                                    showMonthYearPicker
                                    placeholderText="Select Date Start"
                                />
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="flex items-center pb-2">
                                <h2 className="font-semibold">Date End</h2>
                                <FaCalendarAlt className="ml-2" />
                            </div>
                            <div className="w-full pb-5 gap-4">
                                <DatePicker
                                    selected={selectedDateEnd}
                                    onChange={(date) => setSelectedDateEnd(date)}
                                    dateFormat="MM/yyyy"
                                    minDate={new Date()}
                                    showMonthYearPicker
                                    placeholderText="Select Date End"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="my-8">
                        <Button type="submit">Create New School Year</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateSchoolYear