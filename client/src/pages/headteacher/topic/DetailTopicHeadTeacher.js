import React, { useCallback, useEffect, useState } from "react"
import { Button, InputForm, MarkDownEditor, Loading } from "components"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { validate } from "ultils/helper"
import { toast } from "react-toastify"
import {
    apiGetAllDepartment,
    apiGetMajorByDepartment,
    apiCreateTopic,
    apiGetSchoolYears,
    apiGetUsers,
    apiGetLecturer,
    apiCreateTask,
    apiGetTasks,
    apiDeleteTask
} from "apis"
import { showModal } from "store/app/appSilice"
import Select from "react-select"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import icons from "ultils/icons"
import moment from "moment"
import DOMPurify from "dompurify"
import Swal from "sweetalert2"

const DetailTopicHeadTeacher = ({ onDetail, setOnDetail, render }) => {
    const { FaCalendarAlt } = icons
    const dispatch = useDispatch()
    const [selectedDateEnd, setSelectedDateEnd] = useState(null)
    const [selectedDateStart, setSelectedDateStart] = useState(null)
    const [task, setTask] = useState(null)
    const [updateTask, setUpdateTask] = useState(false)
    const fetchTask = async (data) => {
        const response = await apiGetTasks(data)
        if (response.success) setTask(response.tasks)
    }
    useEffect(() => {
        fetchTask({ topic: onDetail._id })
    }, [updateTask])
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm()

    const [payload, setPayload] = useState({
        description: "",
    })

    const [invalidFields, setInvalidFields] = useState([])
    const changeValue = useCallback(
        (e) => {
            setPayload(e)
        },
        [payload]
    )
    const handleCreateTopic = async (data) => {
        const finalPayload = {
            ...data,
            ...payload,
            topic: onDetail._id,
            DateStart: selectedDateStart,
            DateEnd: selectedDateEnd,
        }
        console.log(finalPayload)
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        window.scrollTo(0, 0)
        const response = await apiCreateTask(finalPayload)
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
        if (response.success) {
            reset()
            setUpdateTask(!updateTask)
            toast.success("Create Topic Success !")
        } else {
            toast.error("Fail!!!")
        }
        //   }
    }
    const handleDeleteTask = (tid) => {
        Swal.fire({
            title: "Are you sure",
            text: "Sure friends ?",
            icon: "warning",
            showCancelButton: true,
        }).then(async (rs) => {
            if (rs.isConfirmed) {
                const response = await apiDeleteTask(tid);
                if (response.success) toast.success(response.mes);
                else toast.error(response.mes);
                setUpdateTask(!updateTask)
                render();
            }
        });
    }
    return (
        <div className="w-full flex flex-col gap-4 px-4 relative">
            <div className="p-4 border-b  bg-gray-100 flex justify-between items-center  top-0 left-[327px] right-0">
                <h1 className="text-3xl font-bold tracking-tight">Detail Topic</h1>
                <div className='flex gap-2'>

                    <span
                        className="text-main hover:underline cursor-pointer"
                        onClick={() => setOnDetail(null)}
                    >
                        Cancel
                    </span>
                </div>
            </div>
            <div className='w-full flex justify-center'>
                <div className='p-4 flex flex-col gap-2 shadow-2xl w-[400px]'>
                    <span>
                        <label className='font-bold'>Title:</label> {onDetail?.title}
                    </span>
                    <span>
                        <label className='font-bold'>School Year: </label>{onDetail?.schoolYear}
                    </span>
                    <span>
                        <label className='font-bold'>Major:</label> {onDetail?.major}
                    </span>
                    <span>
                        <label className='font-bold'>Department: </label>{onDetail?.department}
                    </span>
                    <span>
                        <label className='font-bold'>Instructors:</label> {onDetail?.instructors?.firstname} {onDetail?.instructors?.lastname}
                    </span>
                    <span>
                        <label className='font-bold'>Reviewer:</label> {onDetail?.reviewer?.firstname} {onDetail?.reviewer?.lastname}
                    </span>
                    <span>
                        <label className='font-bold'>Students: </label>{onDetail?.students?.map(el =>
                        (
                            <span>{el.firstname} {el.lastname}, </span>
                        ))}
                    </span>
                    <span className="line-clamp-1">
                        <label className='font-bold'>Date Start: </label>
                        {moment(onDetail?.DateStart).format("DD/MM/YYYY")}
                        <label className='font-bold ml-2'>Date End: </label>
                        {moment(onDetail?.DateEnd).format("DD/MM/YYYY")}
                    </span>
                    <span >
                        {
                            onDetail?.status === 'Pending' ?
                                <>
                                    <label className='font-bold'>Status: </label>
                                    <span className='text-yellow-500'>{onDetail?.status}</span>
                                </>
                                :
                                <>
                                    <label className='font-bold'>Status: </label>
                                    <span className='text-green-500'>{onDetail?.status}</span>
                                </>
                        }

                    </span>
                </div>
            </div>
            <div className="p-4">
                <h1 className="text-2xl font-bold tracking-tight">Current Task</h1>
                <div className="flex flex-col gap-2">
                    {task?.map(el => (
                        <div className="flex flex-col py-2 px-2 gap-1 border-solid border-2 border-black rounded-lg">
                            <div className="flex justify-between">
                                <div>
                                    <span>
                                        <label className='font-bold'>Title:</label> {el?.title}
                                    </span>
                                </div>
                                <div onClick={() => { handleDeleteTask(el._id) }} className="cursor-pointer text-red-500 mr-2">X</div>
                            </div>
                            <span className="line-clamp-1">
                                <label className='font-bold'>Open at: </label>
                                {moment(el?.DateStart).format("DD/MM/YYYY")}
                            </span>
                            <span className="line-clamp-1">
                                <label className='font-bold'>Dead line: </label>
                                {moment(el?.DateEnd).format("DD/MM/YYYY")}
                            </span>
                            <span>
                                {el?.status === 'Not Submit' ?
                                    <>
                                        <label className='font-bold mr-1'>Status:</label>
                                        <span className="text-red-500">{el?.status}</span>
                                    </>
                                    :
                                    <>
                                        <label className='font-bold mr-1'>Status:</label>
                                        <span className="text-green-500">{el?.status}</span>
                                    </>
                                }
                            </span>
                            <span>
                                <label className='font-bold'>Description:</label>
                                <div
                                    className="text-sm line-clamp-[1] w-[400px]"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(el?.description[0]),
                                    }}
                                ></div>
                            </span>

                        </div>
                    ))}
                </div>
            </div>
            <hr></hr>
            <div className="p-4">
                <h1 className="text-2xl font-bold tracking-tight">Create Task</h1>
                <form onSubmit={handleSubmit(handleCreateTopic)}>
                    <div className="w-full py-5 ">
                        <InputForm
                            label="Task"
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
                    <div className="w-full pt-5">
                        <MarkDownEditor
                            name="description"
                            changeValue={changeValue}
                            label="Description"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2 pt-10 pb-5">
                        <div className="mt-1">
                            <div className="flex items-center">
                                <h2 className="font-semibold">Date Start </h2>
                                <FaCalendarAlt className="ml-2" />
                            </div>
                            <div className="w-full pb-5 gap-4">
                                <DatePicker
                                    selected={selectedDateStart}
                                    onChange={(date) => setSelectedDateStart(date)}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={new Date()}
                                    placeholderText="Select Date Start"
                                />
                            </div>
                        </div>
                        <div className="mt-1">
                            <div>
                                <div className="flex items-center">
                                    <h2 className="font-semibold">Date End </h2>
                                    <FaCalendarAlt className="ml-2" />
                                </div>
                            </div>
                            <div className="w-full pb-5 gap-4 ">
                                <DatePicker
                                    selected={selectedDateEnd}
                                    onChange={(date) => setSelectedDateEnd(date)}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={new Date()}
                                    placeholderText="Select Date End"
                                />
                            </div>
                        </div>

                    </div>
                    <div className="my-8">
                        <Button type="submit">Create new Topic</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DetailTopicHeadTeacher