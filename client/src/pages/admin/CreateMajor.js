import React, { useEffect, useState } from "react";
import { Button, InputForm, Loading } from "components";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { apiCreateMajor, apiGetDepartment } from "apis";
import { showModal } from "store/app/appSilice";

const CreateMajor = () => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();
  const handleCreateMajor = async (data) => {
    const finalPayload = {
      ...data,
      department: selectedDepartment,
    };
    console.log(finalPayload);
    const formData = new FormData();
    for (let i of Object.entries(finalPayload)) {
      formData.append(i[0], i[1]);
    }

    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    window.scrollTo(0, 0);
    const response = await apiCreateMajor(finalPayload);
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
    if (response.success) {
      reset();
      // console.log("CHECK NOTIFICATION");
      toast.success("Create Major Success !");
    } else {
      toast.error("Fail!!!");
    }
  };
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [departmentData, setDepartmentData] = useState(null);

  const fetchDepartment = async () => {
    const response = await apiGetDepartment();
    if (response.success) setDepartmentData(response.department);
  };
  useEffect(() => {
    fetchDepartment();
  }, []);
  return (
    <div className="w-full flex flex-col gap-4 px-4 ">
      <div className="p-4 border-b w-full flex items-center ">
        <h1 className="text-3xl font-bold tracking-tight">Create Major</h1>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateMajor)}>
          <div className="w-full py-5">
            <InputForm
              label="Name Major"
              register={register}
              errors={errors}
              id="title"
              validate={{
                required: "Require",
              }}
              fullWidth
              placeholder="Name of Your Major"
            />
          </div>
          <div className="w-full pt-10 pb-5 flex items-center gap-4">
            <div className="flex-1 items-center">
              <h2 className="font-bold">Department: </h2>
              <Select
                maxMenuHeight={100}
                id="department"
                options={departmentData?.map((department) => ({
                  label: department.title,
                  value: department._id,
                }))}
                isMulti
                onChange={(selectedOptions) => {
                  const selectedValues = selectedOptions.map(
                    (option) => option.label
                  );
                  setSelectedDepartment(selectedValues);
                }}
              />
            </div>
          </div>

          <div className="my-8">
            <Button type="submit">Create New Major</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMajor;
