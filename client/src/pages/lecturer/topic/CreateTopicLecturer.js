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
    apiGetLecturer
} from "apis"
import { showModal } from "store/app/appSilice"
import Select from "react-select"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import icons from "ultils/icons"


const CreateTopicLecturer = () => {
    const { current } = useSelector(state => state.user)
    const { FaCalendarAlt } = icons
    const dispatch = useDispatch()
    const [user, setUsers] = useState(null)
    const [lecturer, setLecturer] = useState(null)
    const [Major, setMajor] = useState(null)
    const [SchoolYear, setSchoolYear] = useState(null)
    const [Department, setDepartment] = useState(null)
    const [selectedDepartment, setSelectedDepartment] = useState(null)
    const [selectedMajor, setSelectedMajor] = useState(null)
    const [selectedDateEnd, setSelectedDateEnd] = useState(null)
    const [selectedDateStart, setSelectedDateStart] = useState(null)
    const [selectedSchoolYear, setSelectedSchoolYear] = useState(null)
    const [selectedStudents, setSelectedStudents] = useState(null)
    const [selectedLecturer, setSelectedLecturer] = useState(null)

    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm()

    const handleCreateTopic = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            const finalPayload = {
                ...data,
                ...payload,
                department: selectedDepartment,
                major: selectedMajor,
                schoolYear: selectedSchoolYear,
                DateStart: selectedDateStart,
                DateEnd: selectedDateEnd,
                students: selectedStudents,
                instructors: selectedLecturer
            }

            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            window.scrollTo(0, 0)
            const response = await apiCreateTopic(finalPayload)
            dispatch(showModal({ isShowModal: false, modalChildren: null }))
            if (response.success) {
                reset()
                setPayload({
                    description: "",
                })
                toast.success("Create Topic Success !")
            } else {
                toast.error("Fail!!!")
            }
            //   }
        }
    }

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

    const fetchUsers = async (params) => {
        const response = await apiGetUsers({
            ...params,
        })
        console.log(response)
        if (response.success) setUsers(response)
    }


    const fetchSchoolYear = async (data) => {
        const response = await apiGetSchoolYears(data)
        console.log("SCHOOL YEAR")
        if (response.success) {
            setSchoolYear(response.SchoolYears)
        }
    }

    useEffect(() => {
        setSelectedDepartment(current?.department)
        setSelectedMajor(current?.major)
        setSelectedLecturer(current?._id)
        fetchSchoolYear({ sort: "title" })
    }, [])
    useEffect(() => {
        fetchUsers({ role: 4, schoolYear: `${selectedSchoolYear}`, major: `${selectedMajor}`, department: `${selectedDepartment}` })
    }, [selectedDepartment, selectedMajor, selectedSchoolYear])

    console.log(current)
    return (
        <div className="w-full flex flex-col gap-4 px-4 ">
            <div className="p-4 border-b w-full flex items-center ">
                <h1 className="text-3xl font-bold tracking-tight">Create Topic Head Teacher</h1>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleCreateTopic)}>
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
                    <div className="w-full flex gap-2 pt-10 pb-5">
                        <div className="flex-1 items-center justify-center w-full">
                            <h2 className="font-bold pb-2">School year:</h2>
                            <Select
                                maxMenuHeight={150}
                                label="School Year"
                                options={SchoolYear?.map((el) => ({
                                    value: el._id,
                                    label: `${el.title}`,
                                }))}
                                id="schoolYear"
                                placeholder={"Select School Year"}
                                onChange={(selectedOptions) => {
                                    setSelectedSchoolYear(selectedOptions.label)
                                }}
                                errors={errors}
                            />
                        </div>
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

                    <div className="w-full pb-5 flex items-center gap-4">
                        <div className="flex-1 items-center">
                            <h2 className="font-bold pb-2">Department:</h2>
                            <Select
                                defaultValue={{ value: current?.department, label: current?.department }}
                                maxMenuHeight={150}
                                label="Department"
                                id="department"
                                isDisabled={true}
                                placeholder={"Select Department"}
                                onChange={(selectedOptions) => {
                                    setSelectedDepartment(selectedOptions.label)
                                }}
                                errors={errors}
                            />
                        </div>
                        <div className="flex-1 items-center">
                            <h2 className="font-bold pb-2">Major:</h2>
                            <Select
                                defaultValue={{ value: current?.major, label: current?.major }}
                                maxMenuHeight={150}
                                label="Major"
                                id="major"
                                isDisabled={true}
                                onChange={(selectedOptions) => {
                                    setSelectedMajor(selectedOptions.label)
                                }}
                                errors={errors}
                            />
                        </div>
                    </div>
                    <div className="w-full pb-5 flex items-center gap-4">
                        <div className="flex-1 items-center">
                            <h2 className="font-bold pb-2">Lecturer:</h2>
                            <Select
                                defaultValue={{ value: current?._id, label: current?.email }}
                                maxMenuHeight={150}
                                label="Lecturer"
                                isDisabled={true}
                                id="lecturer"
                                placeholder={"Select Lecturer"}
                                onChange={(selectedOptions) => {
                                    setSelectedLecturer(selectedOptions.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="w-full pb-5 flex items-center gap-4">
                        <div className="flex-1 items-center">
                            <h2 className="font-bold pb-2">Students:</h2>
                            <Select
                                maxMenuHeight={90}
                                label="Students"
                                options={user?.users?.map((el) => ({
                                    value: el._id,
                                    label: el.email,
                                }))}
                                isMulti
                                id="students"
                                placeholder={"Select Students"}
                                isDisabled={true ? !selectedSchoolYear || !selectedDepartment || !selectedMajor : false}
                                isOptionDisabled={() => selectedStudents?.length >= 3}
                                onChange={(selectedOptions) => {
                                    setSelectedStudents(selectedOptions.map((option) => option.value));
                                }}
                            />
                        </div>
                    </div>

                    <div className="w-full pt-20">
                        <MarkDownEditor
                            name="description"
                            changeValue={changeValue}
                            label="Description"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />
                    </div>

                    <div className="my-8">
                        <Button type="submit">Create new Topic</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateTopicLecturer