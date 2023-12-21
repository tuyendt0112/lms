import React from "react";
import { Button, InputForm, Loading } from "components";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { toast } from "react-toastify";
import { apiCreateDepartment } from "apis";
import { showModal } from "store/app/appSilice";

const CreateDepartment = () => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  const handleCreateDepartment = async (data) => {
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    const response = await apiCreateDepartment(data);
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
    if (response.success) {
      reset();

      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 px-4 ">
      <div className="p-4 border-b w-full flex items-center ">
        <h1 className="text-3xl font-bold tracking-tight">Create Department</h1>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateDepartment)}>
          <div className="w-full pt-5 pb-10 flex gap-4">
            <InputForm
              label="Name department"
              register={register}
              errors={errors}
              id="title"
              validate={{
                required: "Need to be fill",
              }}
              fullWidth
              style="flex-1"
              placeholder="Name of new Department"
            />
          </div>
          <div className="my-8">
            <Button type="submit">Create New Department</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDepartment;
