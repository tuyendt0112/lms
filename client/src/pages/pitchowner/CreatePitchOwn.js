import React, { useCallback, useEffect, useState } from "react";
import { Button, InputForm, MarkDownEditor, Loading } from "components";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { validate, getBase64 } from "ultils/helper";
import { toast } from "react-toastify";
import { apiCreatePitch, apiGetBrandByOwner } from "apis";
import { showModal } from "store/app/appSilice";
import Select from "react-select";
const CreatePitch = () => {
  const dispatch = useDispatch();
  const [Cate, setCate] = useState(null);
  const { current } = useSelector((state) => state.user);
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  const handleCreatePitch = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      //   if (data.category) {
      //     data.category = categories?.find(
      //       (el) => el._id === data.category
      //     )?.title;
      const finalPayload = {
        ...data,
        ...payload,
        owner: current._id,
        category: selectedCategories,
        brand: brand?.title,
      };
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
      window.scrollTo(0, 0);
      const response = await apiCreatePitch(formData);
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
        toast.success("Create Pitch Success !");
      } else {
        toast.error("Fail!!!");
      }
      //   }
    }
  };
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [brand, setBrand] = useState(null);
  const fetchBrandByOwner = async (uid) => {
    const response = await apiGetBrandByOwner(uid);
    // console.log(response);
    if (response.success) setBrand(response.brandData);
    setCate(response.brandData.categories);
  };
  useEffect(() => {
    fetchBrandByOwner(current._id);
    console.log("eeeee");
  }, []);
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

  useEffect(() => {
    if (watch("thumb")) handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);

  useEffect(() => {
    handlePreviewImages(watch("images"));
  }, [watch("images")]);
  return (
    <div className="w-full flex flex-col gap-4 px-4 ">
      <div className="p-4 border-b w-full flex items-center ">
        <h1 className="text-3xl font-bold tracking-tight">Create Pitch</h1>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreatePitch)}>
          <div className="w-full py-5">
            <InputForm
              label="Name pitch"
              register={register}
              errors={errors}
              id="title"
              validate={{
                required: "Need to be fill",
              }}
              fullWidth
              style="flex-1"
              placeholder="Name of new pitch"
            />
          </div>
          <div className="w-full pt-10 pb-5 flex items-center gap-4">
            <div className="flex-1 items-center">
              <h2 className="font-bold">Owner:</h2>
              <InputForm
                // label="owner"
                register={register}
                errors={errors}
                id="owner"
                validate={{}}
                style="flex-1"
                value={current._id}
                placeholder={`${current.firstname} ${current.lastname}`}
                disable={true}
              />
            </div>
          </div>

          <div className="w-full pt-5 pb-10 flex gap-4">
            <InputForm
              label="Price pitch"
              register={register}
              errors={errors}
              id="price"
              validate={{
                required: "Need to be fill",
              }}
              style="flex-1"
              placeholder="Price of new pitch"
              type="number"
            />
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
          <div className="w-full flex-1 items-center gap-2 pt-5">
            <h2 className="font-bold">Category:</h2>
            <Select
              maxMenuHeight={100}
              label="Category"
              options={Cate?.map((el) => ({
                code: el,
                label: el,
              }))}
              id="category"
              onChange={(selectedOptions) => {
                setSelectedCategories(selectedOptions.label);
              }}
            />
            <InputForm
              label="Brand"
              register={register}
              errors={errors}
              id="brand"
              validate={{}}
              style="flex-1"
              value={brand?.title}
              placeholder={`${brand?.title || "brand"}`}
              disable={true}
            />
          </div>
          <div className="w-full pt-10 gap-2">
            <MarkDownEditor
              name="description"
              changeValue={changeValue}
              label="Description"
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          </div>
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
            <Button type="submit">Create new pitch</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePitch;
