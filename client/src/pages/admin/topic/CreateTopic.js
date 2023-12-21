import React, { useCallback, useEffect, useState } from "react";
import { Button, InputForm, MarkDownEditor, Loading } from "components";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { validate } from "ultils/helper";
import { toast } from "react-toastify";
import {
  apiGetAllDepartment,
  apiGetMajorByDepartment,
  apiCreateTopic,
} from "apis";
import { showModal } from "store/app/appSilice";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import icons from "ultils/icons";
const CreateTopic = () => {
  const { FaCalendarAlt } = icons;
  const dispatch = useDispatch();

  const [Major, setMajor] = useState(null);
  const [Department, setDepartment] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  const handleCreateTopic = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      const finalPayload = {
        ...data,
        ...payload,
        department: selectedDepartment,
        major: selectedMajor,
        DateStart: selectedDateStart,
        DateEnd: selectedDateEnd,
      };
      console.log(finalPayload);
      // const formData = new FormData();
      // for (let i of Object.entries(finalPayload)) {
      //   formData.append(i[0], i[1]);
      // }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      window.scrollTo(0, 0);
      const response = await apiCreateTopic(finalPayload);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        reset();
        setPayload({
          description: "",
        });
        toast.success("Create Topic Success !");
      } else {
        toast.error("Fail!!!");
      }
      //   }
    }
  };

  const [payload, setPayload] = useState({
    description: "",
  });

  const [invalidFields, setInvalidFields] = useState([]);
  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  const fetchDepartment = async () => {
    const response = await apiGetAllDepartment({ limit: 99 });
    if (response.success) setDepartment(response.Departments);
  };

  useEffect(() => {
    fetchDepartment();
  }, []);
  useEffect(() => {
    if (selectedDepartment) {
      fetchMajorByDepartment(selectedDepartment);
    }
  }, [selectedDepartment]);

  const fetchMajorByDepartment = async (data) => {
    const response = await apiGetMajorByDepartment(data);
    if (response.success) {
      setMajor(response.data.majors);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 px-4 ">
      <div className="p-4 border-b w-full flex items-center ">
        <h1 className="text-3xl font-bold tracking-tight">Create Topic</h1>
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
          <div className="w-full py-5 ">
            <InputForm
              label="ID of Topic"
              register={register}
              errors={errors}
              id="topicId"
              validate={{
                required: "Need to be fill",
              }}
              fullWidth
              style="flex-1"
              placeholder="ID of new Topic"
            />
          </div>
          <div className="w-full pt-10 pb-5 flex items-center gap-4">
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

          <div className=" items-center">
            <h2 className="font-semibold">Date Start:</h2>
            <div className="w-full pb-5  gap-4">
              <FaCalendarAlt className="mr-2" />

              <DatePicker
                selected={selectedDateStart}
                onChange={(date) => setSelectedDateStart(date)}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                placeholderText="Select Date Start"
              />
            </div>
            <h2 className="font-semibold">Date End:</h2>
            <div className="w-full pb-5 gap-4">
              <FaCalendarAlt className="mr-2" />
              <DatePicker
                selected={selectedDateEnd}
                onChange={(date) => setSelectedDateEnd(date)}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                placeholderText="Select Date End"
              />
            </div>
            <div></div>
          </div>

          <div className="w-full pt-14">
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
  );
};

export default CreateTopic;
