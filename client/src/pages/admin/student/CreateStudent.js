import React, { useCallback, useEffect, useState } from "react";
import { Button, InputForm, MarkDownEditor, Loading } from "components";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { validate, getBase64, generatePassword } from "ultils/helper";
import { toast } from "react-toastify";
import {
  apiGetAllDepartment, apiGetMajorByDepartment, apiCreateUserByAdmin, apiGetSchoolYears
} from "apis";
import { showModal } from "store/app/appSilice";
import Select from "react-select";

const CreateStudent = () => {
  const dispatch = useDispatch();
  const [Users, setUsers] = useState(null);
  const [Major, setMajor] = useState(null);
  const [SchoolYear, setSchoolYear] = useState(null);
  const [Department, setDepartment] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  const handleCreateStudent = async (data) => {

    const finalPayload = {
      ...data,
      role: 4,
      // password: generatePassword(),
      password: 123456,
      schoolyear: selectedSchoolYear,
      department: selectedDepartment,
      major: selectedMajor,
    };

    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    window.scrollTo(0, 0);
    const response = await apiCreateUserByAdmin(finalPayload);
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
    console.log(response)
    if (response.success) {
      reset();
      toast.success("Create User Success !");
    } else {
      toast.error("Fail!!!");
    }
  };

  const fetchDepartment = async () => {
    const response = await apiGetAllDepartment({ limit: 99 });
    if (response.success) setDepartment(response.Departments);
  };
  const fetchMajorByDepartment = async (data) => {
    const response = await apiGetMajorByDepartment(data);
    if (response.success) {
      setMajor(response.data.majors);
    }
  };
  const fetchSchoolYear = async (data) => {
    const response = await apiGetSchoolYears(data);
    if (response.success) {
      setSchoolYear(response.SchoolYears);
    }
  };

  useEffect(() => {
    fetchDepartment()
    fetchSchoolYear()
  }, []);
  useEffect(() => {
    if (selectedDepartment) {
      fetchMajorByDepartment(selectedDepartment);
    }
  }, [selectedDepartment]);

  return (
    <div className="w-full flex flex-col gap-4 px-4 ">
      <div className="p-4 border-b w-full flex items-center ">
        <h1 className="text-3xl font-bold tracking-tight">Create Student</h1>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateStudent)}>
          <div className="w-full flex gap-2 py-5 ">
            <InputForm
              label="First name"
              register={register}
              errors={errors}
              id="firstname"
              validate={{
                required: "Need to be fill",
              }}
              fullWidth
              style="flex-1"
              placeholder="First name of new student ..."
            />
            <InputForm
              label="Last name"
              register={register}
              errors={errors}
              id="lastname"
              validate={{
                required: "Need to be fill",
              }}
              fullWidth
              style="flex-1"
              placeholder="Last name of new student ..."
            />
          </div>
          <div className="flex gap-2 pt-10 pb-5">
            <InputForm
              label="Student code"
              register={register}
              errors={errors}
              id="codeid"
              validate={{
                required: "Need to be fill",
              }}
              fullWidth
              style="flex-1"
              placeholder="New student id code ..."
            />
            <InputForm
              label="Student email"
              register={register}
              errors={errors}
              id="email"
              validate={{
                required: "Need to be fill",
              }}
              fullWidth
              style="flex-1"
              placeholder="New student email ..."
            />
          </div>
          <div className="w-full flex gap-2 pt-10 pb-5">
            <div className="flex-1 items-center justify-center w-full">
              <h2 className="font-bold pb-2">School year:</h2>
              <Select
                maxMenuHeight={150}
                label="School Year"
                options={SchoolYear?.map((el) => ({
                  code: el._id,
                  label: `${el.title} `,
                }))}
                id="schoolyear"
                placeholder={"Select School Year"}
                onChange={(selectedOptions) => {
                  setSelectedSchoolYear(selectedOptions.code);
                }}
                errors={errors}
              />
            </div>
          </div>
          <div className="w-full pt-5 flex items-center gap-2">
            <div className="flex-1 items-center">
              <h2 className="font-bold">Department:</h2>
              <Select
                maxMenuHeight={150}
                label="Department"
                options={Department?.map((el) => ({
                  code: el._id,
                  label: `${el.title}`,
                }))}
                id="department"
                placeholder={"Select Department"}
                onChange={(selectedOptions) => {
                  setSelectedDepartment(selectedOptions.label);
                }}
                errors={errors}
              />
            </div>
            <div className="flex-1 items-center">
              <h2 className="font-bold">Major:</h2>
              <Select
                maxMenuHeight={150}
                label="Major"
                options={Major?.map((el) => ({
                  label: el,
                }))}
                id="major"
                onChange={(selectedOptions) => {
                  setSelectedMajor(selectedOptions.label);
                }}
              />
            </div>
          </div>
          <div className="my-8">
            <Button type="submit">Create New Pitch</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;
