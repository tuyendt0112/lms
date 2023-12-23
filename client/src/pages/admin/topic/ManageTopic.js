import React, { useCallback, useEffect, useState } from "react";
import { InputForm, Pagination } from "components";
import { useForm } from "react-hook-form";
import { apiGetTopics, apiDeleteTopic } from "apis";
import defaultt from "assets/default.png";
import moment from "moment";
import icons from "ultils/icons";
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import useDebounce from "hooks/useDebounce";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import UpdateTopic from "./UpdateTopic";

const { AiFillStar, MdEdit, MdDeleteForever } = icons;
const ManageTopic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();
  const [topics, setTopics] = useState(null);
  const [counts, setCounts] = useState(0);
  const [editTopic, setEditTopic] = useState(null);
  const [update, setUpdate] = useState(false);

  const render = useCallback(() => {
    setUpdate(!update);
  });
  const fetchTopics = async (params) => {
    const response = await apiGetTopics({
      ...params,
      limit: process.env.REACT_APP_PITCH_LIMIT,
    });
    console.log(response)
    if (response.success) {
      console.log(response);
      setTopics(response.pitches);
      setCounts(response.counts);
    }
  };

  const queryDecounce = useDebounce(watch("q"), 800);
  // const queryDecounce = useDebounce(queries.q, 500)
  useEffect(() => {
    if (queryDecounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ q: queryDecounce }).toString(),
      });
    } else {
      navigate({
        pathname: location.pathname,
      });
    }
  }, [queryDecounce]);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchTopics(searchParams);
  }, [params, update]);

  const handleDeletePitch = (pid) => {
    Swal.fire({
      title: "Are you sure",
      text: "Sure friends ?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteTopic(pid);
        if (response.success) toast.success(response.mes);
        else toast.error(response.mes);
        render();
      }
    });
  };
  console.log(topics)
  return (
    <div className="w-full flex flex-col gap-4 px-4 relative">
      {editTopic && (
        <div className="absolute inset-0 win-h-screen bg-gray-100 z-50">
          <UpdateTopic
            editTopic={editTopic}
            render={render}
            setEditTopic={setEditTopic}
          />
        </div>
      )}
      <div className="p-4 border-b w-full flex items-center ">
        <h1 className="text-3xl font-bold tracking-tight">Manage Topic</h1>
      </div>
      <div className="flex w-full justify-end items-center px-1">
        {/* <form className='w-[300px]' onSubmit={handleSubmit(handleManagePitch)}> */}
        <form className="w-[300px]">
          <InputForm
            id="q"
            register={register}
            errors={errors}
            fullWidth
            transform
            placeholder="Search products by title, description ..."
          />
        </form>
      </div>
      <table className="table-auto w-full ">
        <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr className="bg-sky-900 text-white  py-2">
            <th className="px-4 py-2 text-center h-[60px] w-[30px] rounded-tl-lg">
              #
            </th>
            <th className="px-4 py-2 text-center h-[60px] w-[100px] ">Title</th>
            <th className="px-4 py-2 text-center h-[60px] w-[100px] ">Major</th>
            <th className="px-4 py-2 text-center h-[60px] w-[100px] ">
              Department
            </th>
            <th className="px-4 py-2 text-center h-[60px] w-[100px] ">Students</th>
            <th className="px-4 py-2 text-center h-[60px] w-[100px] ">Lecturer</th>

            <th className="px-4 py-2 text-center h-[60px] w-[100px] ">
              Date Start
            </th>
            <th className="px-4 py-2 text-center h-[60px] w-[100px] ">
              Date End
            </th>
            <th className="px-4 py-2 text-center  h-[60px] w-[100px] rounded-tr-lg">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {topics?.map((el, index) => (
            <tr
              className='odd:bg-white odd:dark:bg-gray-300 even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700"'
              key={el._id}
            >
              <td className="text-center px-6 py-5 ">
                {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                  process.env.REACT_APP_PITCH_LIMIT +
                  index +
                  1}
              </td>
              <td className="text-center py-2">
                <div className="line-clamp-1">{el.title}</div>
              </td>
              <td className="text-center py-2">{el.major}</td>
              <td className="text-center py-2">{el.department}</td>
              <td className="text-center py-2">
                <div className="flex flex-col items-center justify-center">
                  {el.students?.map((el, index) => (
                    <sm key={index + 1}>{el?.firstname} {el?.lastname}</sm>
                  ))}
                </div>
              </td>
              <td className="text-center py-2">
                <div className="flex flex-col items-center justify-center">
                  <sm >{el?.instructors?.firstname} {el?.instructors?.lastname} </sm>
                </div>
              </td>
              <td className="text-center py-2">
                {moment(el.DateStart).format("DD/MM/YYYY")}
              </td>
              <td className="text-center py-2">
                {moment(el.DateEnd).format("DD/MM/YYYY")}
              </td>
              <td className="text-center py-2">
                <div className="flex items-center justify-center">
                  <span
                    className="text-green-500 hover:text-green-700 cursor-pointer px-2 text-2xl"
                    onClick={() => setEditTopic(el)}
                  >
                    <FaRegEdit />
                  </span>
                  <span
                    onClick={() => handleDeletePitch(el._id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer px-2 text-2xl"
                  >
                    <MdDeleteForever />
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full flex justify-end my-8">
        <Pagination totalCount={counts} type="topics" />
      </div>
    </div>
  );
};

export default ManageTopic;
