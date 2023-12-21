import React, { useEffect, memo } from "react";
import { Button, InputForm, Loading } from "components";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { apiUpdateCategory, apiUpdateMajor } from "apis";
import { showModal } from "store/app/appSilice";

const UpdateMajor = ({ editMajor, render, setEditMajor }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  const handleUpdateMajor = async (data) => {
    const finalPayload = { ...data };
    console.log(finalPayload);

    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    const response = await apiUpdateMajor({
      title: finalPayload.title,
      mid: editMajor._id,
    });
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
    if (response.success) {
      toast.success(response.message);
      render();
      setEditMajor(null);
    } else toast.error(response.message);
  };

  useEffect(() => {
    reset({
      title: editMajor?.title || "",
    });
  }, [editMajor]);
  return (
    <div className="w-full flex flex-col gap-4 px-4 relative">
      <div className="p-4 border-b  bg-gray-100 flex justify-between items-center  top-0 left-[327px] right-0">
        <h1 className="text-3xl font-bold tracking-tight">Update Major</h1>
        <span
          className="text-main hover:underline cursor-pointer"
          onClick={() => setEditMajor(null)}
        >
          Cancel
        </span>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleUpdateMajor)}>
          <InputForm
            label="Name major"
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
            <Button type="submit">Update Major</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(UpdateMajor);
