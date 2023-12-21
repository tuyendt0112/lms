import React, { useEffect, memo } from "react";
import { Button, InputForm, Loading } from "components";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { apiUpdateDepartment } from "apis";
import { showModal } from "store/app/appSilice";

const UpdateDepartment = ({ editDepartment, render, setEditDepartment }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  const handleUpdateDepartment = async (data) => {
    const finalPayload = { ...data };
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    const response = await apiUpdateDepartment({
      title: finalPayload.title,
      did: editDepartment._id,
    });
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
    if (response.success) {
      toast.success(response.message);
      render();
      setEditDepartment(null);
    } else toast.error(response.message);
  };

  useEffect(() => {
    reset({
      title: editDepartment?.title || "",
    });
  }, [editDepartment]);
  return (
    <div className="w-full flex flex-col gap-4 px-4 relative">
      <div className="p-4 border-b  bg-gray-100 flex justify-between items-center  top-0 left-[327px] right-0">
        <h1 className="text-3xl font-bold tracking-tight">Update Department</h1>
        <span
          className="text-main hover:underline cursor-pointer"
          onClick={() => setEditDepartment(null)}
        >
          Cancel
        </span>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleUpdateDepartment)}>
          <InputForm
            label="Name Department"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Need to be fill",
            }}
            fullWidth
            placeholder="Name of Major"
          />

          <div className="my-8 pt-4">
            <Button type="submit">Update Department</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(UpdateDepartment);
