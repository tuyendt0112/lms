import React, { useCallback, useEffect, useState, memo } from "react"
import { Button, InputForm, MarkDownEditor, Loading } from "components"
import { useForm } from "react-hook-form"
import { useSelector, useDispatch } from "react-redux"
import { validate, getBase64 } from "ultils/helper"
import { toast } from "react-toastify"
import {
    apiUpdateNotification
} from "apis"
import { showModal } from "store/app/appSilice"
import icons from "ultils/icons"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Select from "react-select"


const UpdateNotification = ({ editNotification, setEditNotification, render }) => {
    const dispatch = useDispatch()
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm()
    const handleUpdateNotification = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            // if (data.departmentData)
            //   data.departmentData = departmentData?.find(
            //     (el) => el.title === data.departmentData
            //   )?.title
            const finalPayload = {
                ...data,
                ...payload,
            }
            console.log("finalPayload", finalPayload)
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            window.scrollTo(0, 0)
            const response = await apiUpdateNotification(finalPayload, editNotification._id)
            dispatch(showModal({ isShowModal: false, modalChildren: null }))
            if (response.success) {
                toast.success(response.mes)
                render()
                setEditNotification(null)
            } else toast.error(response.mes)
        }
    }
    const [payload, setPayload] = useState({
        content: "",
    })


    const [invalidFields, setInvalidFields] = useState([])
    const changeValue = useCallback(
        (e) => {
            setPayload(e)
        },
        [payload]
    )
    useEffect(() => {
        reset({
            title: editNotification?.title || "",
        })
        setPayload({
            content:
                typeof editNotification?.content === "object"
                    ? editNotification?.content?.join(", ")
                    : editNotification?.content,
        })

    }, [editNotification])
    console.log(editNotification)
    return (
        <div className="w-full flex flex-col gap-4 px-4 relative">
            <div className="p-4 border-b  bg-gray-100 flex justify-between items-center  top-0 left-[327px] right-0">
                <h1 className="text-3xl font-bold tracking-tight">Update Topic</h1>
                <span
                    className="text-main hover:underline cursor-pointer"
                    onClick={() => setEditNotification(null)}
                >
                    Cancel
                </span>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleUpdateNotification)}>
                    <div className="w-full py-5 ">
                        <InputForm
                            label="Title of Topic"
                            register={register}
                            errors={errors}
                            id="title"
                            validate={{
                                required: "Need to be fill",
                            }}
                            fullWidth
                            style="flex-1"
                            placeholder="Title of new Topic"
                        />
                    </div>
                    <div className="w-full pt-5 ">
                        <MarkDownEditor
                            name="content"
                            changeValue={changeValue}
                            label="content"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            value={payload.content}
                        />
                    </div>

                    <div className="my-8">
                        <Button type="submit">Update Topic </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateNotification