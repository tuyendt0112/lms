import React, { useCallback, useEffect, useState } from "react";
import { Button, InputForm, Loading, MarkDownEditor } from "components";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { apiCreateNotification } from "apis";
import { showModal } from "store/app/appSilice";
import { validate } from "ultils/helper";

const CreateNotification = () => {
    const dispatch = useDispatch();
    const [Files, setFiles] = useState(null);
    // const [FileName, setFileName] = useState(null);
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm();
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
    const handleCreateMajor = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            const finalPayload = {
                ...data,
                ...payload
            }
            const formData = new FormData();
            for (let i of Object.entries(finalPayload)) {
                formData.append(i[0], i[1]);
            }
            if (Files) {
                formData.append("file", Files);
            }
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
            window.scrollTo(0, 0);
            const response = await apiCreateNotification(formData);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            if (response.success) {
                reset();
                setPayload({
                    content: "",
                })
                toast.success(response.mes);
            } else {
                toast.error(response.mes);
            }
        }
    };

    return (
        <div className="w-full flex flex-col gap-4 px-4 ">
            <div className="p-4 border-b w-full flex items-center ">
                <h1 className="text-3xl font-bold tracking-tight">
                    Create Notification
                </h1>
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
                    <div className="w-full pt-20">
                        <MarkDownEditor
                            name="content"
                            changeValue={changeValue}
                            label="Content"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />
                    </div>
                    <div className="flex flex-col gap-2 py-2">
                        <h4>Upload Pdf </h4>
                        <form enctype="multipart/form-data">
                            <input
                                type="file"
                                className="form-control"
                                accept="application/pdf"
                                require="true"
                                onChange={(e) => setFiles(e.target.files[0])}
                            ></input>
                        </form>
                    </div>
                    <div className="my-8">
                        <Button type="submit">Create New Notification</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateNotification;
