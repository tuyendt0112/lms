import React, { useCallback, useEffect, useState } from "react";
import {
    Button,
    InputForm,
    MarkDownEditor,
    // Select,
    Loading,
} from "components";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { validate, getBase64 } from "ultils/helper";
import { toast } from "react-toastify";
import { apiCreateBrand } from "apis";
import { showModal } from "store/app/appSilice";

const CreateOwnerBrand = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.app);

    const { current } = useSelector((state) => state.user);
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm();
    const handleCreateBrand = async (data) => {
        console.log(selectedCategories);
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            // if (data.categories) {
            //   data.category = categories?.find(
            //     (el) => el._id === data.category
            //   )?.title;
            const finalPayload = {
                ...data,
                ...payload,
                owner: current._id,
                categories: selectedCategories,
            };
            console.log({ ...data, ...payload });
            const formData = new FormData();
            for (let i of Object.entries(finalPayload)) {
                formData.append(i[0], i[1]);
            }
            if (finalPayload.thumb) {
                formData.append("thumb", finalPayload.thumb[0]);
            }
            if (finalPayload.images) {
                for (let image of finalPayload.images) formData.append("images", image);
            }
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
            window.scrollTo(0, 0)
            const response = await apiCreateBrand(formData);
            console.log(formData);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            if (response.success) {
                reset();
                setPayload({
                    description: "",
                });
                setPreview({
                    thumb: null,
                    images: [],
                });
                // console.log("CHECK NOTIFICATION");
                toast.success("Create Brand Success !");
            } else {
                toast.error("Fail!!!");
            }
        }
    };
    const [payload, setPayload] = useState({
        description: "",
    });
    const [preview, setPreview] = useState({
        thumb: null,
        images: [],
    });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [invalidFields, setInvalidFields] = useState([]);
    const changeValue = useCallback(
        (e) => {
            setPayload(e);
        },
        [payload]
    );

    const [hover, setHover] = useState(null);
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
            imagesPreview.push({ name: file.name, path: base64 });
        }
        setPreview((prev) => ({ ...prev, images: imagesPreview }));
    };
    const [selectedOptions, setSelectedOptions] = useState([]);
    // const handleRemove = (name) => {
    //     const files = [...watch('images')]
    //     reset({
    //         images: files?.filter(el => el.name !== name)
    //     })
    //     if (preview.images?.some(el => el.name === name)) {
    //         setPreview(prev => ({ ...prev, images: prev.images?.filter(el => el.name !== name) }))
    //     }
    // }
    useEffect(() => {
        if (watch("thumb")) handlePreviewThumb(watch("thumb")[0]);
    }, [watch("thumb")]);

    useEffect(() => {
        handlePreviewImages(watch("images"));
    }, [watch("images")]);

    return (
        <div className="w-full">
            <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
                <span>Create Your Brand</span>
            </h1>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleCreateBrand)}>
                    <InputForm
                        label="Name Brand"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: "Require",
                        }}
                        fullWidth
                        placeholder="Name of Your Brand"
                    />
                    <div className="w-full mt-12 mb-6 flex flex-col gap-4 ">
                        <span className="font-bold">Category</span>
                        <Select
                            maxMenuHeight={100}
                            id="category"
                            options={categories?.map((category) => ({
                                label: category.title,
                                value: category._id,
                            }))}
                            isMulti
                            onChange={(selectedOptions) => {
                                const selectedValues = selectedOptions.map(
                                    (option) => option.label
                                );
                                setSelectedCategories(selectedValues);
                            }}
                        />
                    </div>
                    <div className="w-full mb-12 flex gap-4 ">
                        <InputForm
                            label="Address"
                            register={register}
                            errors={errors}
                            id="address"
                            validate={{
                                required: "Require",
                            }}
                            style="flex-1"
                            placeholder="Address of Your Brand"
                        />
                    </div>

                    <MarkDownEditor
                        name="description"
                        changeValue={changeValue}
                        label="Description"
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                    <div className="flex flex-col gap-2 mt-8">
                        <label className="font-semibold" htmlFor="thumb">
                            Upload thumb
                        </label>
                        <input
                            type="file"
                            id="thumb"
                            {...register("thumb", { required: "Need Select" })}
                        />
                        {errors["thumb"] && (
                            <small className="text-sx text-red-500">
                                {errors["thumb"]?.message}
                            </small>
                        )}
                    </div>
                    {preview.thumb && (
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
                            Upload Image Of Pitch
                        </label>
                        <input
                            type="file"
                            id="pitches"
                            {...register("images", { required: "Need Select" })}
                            multiple
                        />
                        {errors["images"] && (
                            <small className="text-sx text-red-500">
                                {errors["images"]?.message}
                            </small>
                        )}
                    </div>
                    {preview.images.length > 0 && (
                        <div className="my-4 flex w-full gap-3 flex-wrap">
                            {preview.images.map((el) => (
                                <div
                                    onMouseEnter={() => setHover(el.name)}
                                    onMouseLeave={() => setHover(null)}
                                    key={el.name}
                                    className="w-fit relative"
                                >
                                    <img
                                        src={el.path}
                                        alt="thumbnail"
                                        className="w-[200px] object-contain"
                                    />
                                    {/* {hover === el.name &&
                                        <div
                                            onClick={() => handleRemove(el.name)}
                                            className='absolute inset-0 bg-overlay cursor-pointer flex items-center justify-center' >
                                            <IoTrashBin size={24} color='white' />
                                        </div>
                                    } */}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="my-8">
                        <Button type="submit">Create new brand</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOwnerBrand;
