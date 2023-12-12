import React, { useCallback, useEffect, useState, memo } from "react";
import { Button, InputForm, MarkDownEditor, Loading } from "components";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { validate, getBase64 } from "ultils/helper";
import { toast } from "react-toastify";
import { apiGetAllCategory, apiUpdateBrand } from "apis";
import { showModal } from "store/app/appSilice";
import Select from "react-select";
const UpdateBrand = ({ editBrand, render, setEditBrand }) => {
    const dispatch = useDispatch();
    const [categories, setcategories] = useState(null);
    const [selectedCategories, setselectedCategories] = useState(null);
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm();

    const handleUpdateBrand = async (data) => {
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            if (data.categories) data.categories = selectedCategories;
            const finalPayload = {
                bid: editBrand._id,
                ...data,
                ...payload,
            };
            console.log(finalPayload);
            finalPayload.thumb =
                data?.thumb?.length === 0 ? preview.thumb : data.thumb[0];
            const formData = new FormData();
            for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
            finalPayload.images =
                data.images?.length === 0 ? preview.images : data.images;
            for (let image of finalPayload.images) formData.append("images", image);
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
            console.log(formData);
            const response = await apiUpdateBrand(formData);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            if (response.success) {
                toast.success(response.message);
                render();
                setEditBrand(null);
            } else toast.error(response.message);
        }
    };
    const [payload, setPayload] = useState({
        description: "",
    });
    const [preview, setPreview] = useState({
        thumb: null,
        images: [],
    });

    const [invalidFields, setInvalidFields] = useState([]);
    const changeValue = useCallback(
        (e) => {
            setPayload(e);
        },
        [payload]
    );

    const handlePreviewThumb = async (file) => {
        const base64Thumb = await getBase64(file);
        setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
    };

    const handlePreviewImages = async (files) => {
        const imagesPreview = [];
        for (let file of files) {
            if (file.type !== "image/png" && file.type !== "image/jpeg") {
                toast.warning("File type not correct");
                return;
            }
            const base64 = await getBase64(file);
            imagesPreview.push(base64);
        }
        setPreview((prev) => ({ ...prev, images: imagesPreview }));
    };
    const fetchCategories = async () => {
        const response = await apiGetAllCategory();
        if (response.success) setcategories(response.PitchCategoriess);
    };

    useEffect(() => {
        fetchCategories();
    }, []);
    useEffect(() => {
        if (watch("thumb") instanceof FileList && watch("thumb").length > 0) {
            handlePreviewThumb(watch("thumb")[0]);
        }
    }, [watch("thumb")]);

    useEffect(() => {
        if (watch("images") instanceof FileList && watch("images").length > 0) {
            handlePreviewImages(watch("images"));
        }
    }, [watch("images")]);

    useEffect(() => {
        reset({
            title: editBrand?.title || "",
            //   price: editBrand?.price || "",
            address: editBrand?.address || "",
            categories: editBrand?.categories || "",
            //   brand: editBrand?.brand || "",
        });
        setPayload({
            description:
                typeof editBrand?.description === "object"
                    ? editBrand?.description?.join(", ")
                    : editBrand?.description,
        });

        setPreview({
            ...preview,
            thumb: editBrand?.thumb,
            images: editBrand?.images,
        });
    }, [editBrand]);
    return (
        <div className="w-full flex flex-col gap-4 px-4 relative">
            <div className="p-4 border-b  bg-gray-100 flex justify-between items-center  top-0 left-[327px] right-0">
                <h1 className="text-3xl font-bold tracking-tight">Update brand</h1>
                <span
                    className="text-main hover:underline cursor-pointer"
                    onClick={() => setEditBrand(null)}
                >
                    Cancel
                </span>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleUpdateBrand)}>
                    <div className="w-full pt-5 pb-10">
                        <InputForm
                            label="Name Brand"
                            register={register}
                            errors={errors}
                            id="title"
                            validate={{
                                required: "Need to be fill",
                            }}
                            fullWidth
                            placeholder="Name of new Brand"
                        />
                    </div>
                    <div className="w-full flex flex-col pt-5">
                        <h2 className="font-bold">Category: </h2>
                        <Select
                            id="categories"
                            options={categories?.map((ct) => ({
                                label: ct.title,
                                value: ct.title,
                            }))}
                            isMulti
                            placeholder={"Select Categories"}
                            onChange={(selectedOptions) => {
                                setselectedCategories(
                                    selectedOptions.map((option) => option.value)
                                );
                            }}
                        />
                    </div>
                    <div className="w-full pt-5 pb-10 ">
                        <InputForm
                            label="Address"
                            register={register}
                            errors={errors}
                            id="address"
                            validate={{
                                required: "Need to be fill",
                            }}
                            style="flex-1"
                            placeholder="Address of new pitch"
                        />
                    </div>
                    <div className="w-full pt-5">
                        <MarkDownEditor
                            name="description"
                            changeValue={changeValue}
                            label="Description"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            value={payload.description}
                        />
                    </div>
                    <div className="flex flex-col gap-2 mt-8">
                        <label className="font-semibold" htmlFor="thumb">
                            Upload thumb
                        </label>
                        <input type="file" id="thumb" {...register("thumb")} />
                        {errors["thumb"] && (
                            <small className="text-sx text-red-500">
                                {errors["thumb"]?.message}
                            </small>
                        )}
                    </div>
                    {preview?.thumb && (
                        <div className="my-4">
                            <img
                                src={preview.thumb}
                                alt="thumbnail"
                                className="w-[200px] object-contain"
                            />
                        </div>
                    )}
                    <div className="flex flex-col gap-2 mt-8">
                        <label className="font-semibold" htmlFor="pitches">
                            Upload Image Of Brand
                        </label>
                        <input type="file" id="pitches" {...register("images")} multiple />
                        {errors["images"] && (
                            <small className="text-sx text-red-500">
                                {errors["images"]?.message}
                            </small>
                        )}
                    </div>
                    {preview?.images?.length > 0 && (
                        <div className="my-4 flex w-full gap-3 flex-wrap">
                            {preview?.images?.map((el) => (
                                <div key={el.name} className="w-fit relative">
                                    <img
                                        src={el}
                                        alt="thumbnail"
                                        className="w-[200px] object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="my-8">
                        <Button type="submit">Update new Brand</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default memo(UpdateBrand);
