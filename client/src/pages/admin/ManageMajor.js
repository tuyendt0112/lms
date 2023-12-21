import React, { useCallback, useEffect, useState } from "react";
import { InputForm, Pagination } from "components";
import { useForm } from "react-hook-form";
import { apiGetAllMajor, apiDeleteMajor } from "apis";
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import useDebounce from "hooks/useDebounce";
import Swal from "sweetalert2";
import UpdateMajor from "./UpdateMajor";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const ManageMajor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();
  const [majors, setMajors] = useState(null);
  const [counts, setCounts] = useState(0);
  const [editMajor, setEditMajor] = useState(null);
  const [update, setUpdate] = useState(false);

  const render = useCallback(() => {
    setUpdate(!update);
  });
  const fetchMajors = async (params) => {
    const response = await apiGetAllMajor({
      ...params,
      limit: process.env.REACT_APP_MAJOR_LIMIT,
    });
    if (response.success) {
      setMajors(response.Majors);
      setCounts(response.totalCount);
    }
  };

  const queryDebounce = useDebounce(watch("q"), 800);

  useEffect(() => {
    if (queryDebounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ q: queryDebounce }).toString(),
      });
    } else {
      navigate({
        pathname: location.pathname,
      });
    }
  }, [queryDebounce]);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchMajors(searchParams);
  }, [params, update]);

  const handleDeleteMajor = (mid) => {
    Swal.fire({
      title: "Are you sure",
      text: "Sure friends ?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteMajor(mid);
        if (response.success) toast.success(response.message);
        else toast.error(response.message);
        render();
      }
    });
  };
  return (
    <div className="w-full flex flex-col gap-4 px-4 relative">
      {editMajor && (
        <div className="absolute inset-0 win-h-screen bg-gray-100 z-50">
          <UpdateMajor
            editMajor={editMajor}
            render={render}
            setEditMajor={setEditMajor}
          />
        </div>
      )}
      <div className="p-4 border-b w-full  flex justify-between items-center ">
        <h1 className="text-3xl font-bold tracking-tight">Manage Majors</h1>
      </div>
      <div className="flex w-full justify-end items-center px-1">
        <form className="w-[300px]">
          <InputForm
            id="q"
            register={register}
            errors={errors}
            fullWidth
            transform
            placeholder="Search major by title"
          />
        </form>
      </div>
      <table className="table-auto w-full ">
        <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr className="bg-sky-900 text-white  py-2">
            <th className="px-4 py-2 text-center h-[60px] rounded-tl-lg">#</th>
            <th className="px-4 py-2 text-center h-[60px] w-[30px] ">Title</th>
            <th className="px-4 py-2 text-center h-[60px] ">Department</th>
            <th className="px-4 py-2 text-center  h-[60px] w-[30px] rounded-tr-lg">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {majors?.map((el, index) => (
            <tr
              className='odd:bg-white odd:dark:bg-gray-300 even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700"'
              key={el._id}
            >
              <td className="text-center py-2">
                {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                  process.env.REACT_APP_MAJOR_LIMIT +
                  index +
                  1}
              </td>
              <td className="text-center py-2">{el.title}</td>
              <td className="text-center py-2">
                <div className="flex flex-col items-center justify-center">
                  {el.departments?.map((dp, index) => (
                    <sm key={index + 1}>{dp}</sm>
                  ))}
                </div>
              </td>
              <td className="text-center py-2">
                <div className="flex items-center justify-center">
                  <span
                    className="text-green-500 hover:text-green-700 cursor-pointer px-2 text-2xl"
                    onClick={() => setEditMajor(el)}
                  >
                    <FaRegEdit />
                  </span>
                  <span
                    onClick={() => handleDeleteMajor(el._id)}
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
        <Pagination totalCount={counts} type="majors" />
      </div>
    </div>
  );
};

export default ManageMajor;
