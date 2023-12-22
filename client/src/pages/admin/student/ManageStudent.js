import React, { useEffect, useState, useCallback } from "react";
import {
  apiGetUsers,
  apiUpdateUserByAdmin,
  apiDeleteUserByAdmin,
  apiGetAllDepartment,
  apiGetMajorByDepartment,
  apiGetSchoolYears
} from "apis";
import { roles, blockStatus } from "ultils/constant";
import moment from "moment";
import { Pagination, InputForm, Select } from "components";
import useDebounce from "hooks/useDebounce";
import defaultImg from "assets/defaultava.png";
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import icons from "ultils/icons";

const { FaRegEdit, MdDeleteForever, FaSave, TiCancel } = icons;
const ManageStudent = () => {
  const [Major, setMajor] = useState(null);
  const [SchoolYear, setSchoolYear] = useState(null);
  const [Department, setDepartment] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);
  const [open, setOpen] = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const [user, setUsers] = useState(null);
  const [update, setUpdate] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const fetchUsers = async (params) => {
    const response = await apiGetUsers({
      ...params,
      limit: process.env.REACT_APP_PITCH_LIMIT,
      role: 4,
    });
    if (response.success) setUsers(response);
  };
  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);
  {
    /*
    Mỗi 0.5s thì mới cập nhật 
    Hàm dưới nghĩa là chừng nào giá trị queriesDebounce thay đổi (0.5/1 lần) thì mới gọi API,
    */
  }
  const queryDebounce = useDebounce(watch("q"), 500);
  useEffect(() => {
    if (queryDebounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ q: queryDebounce }).toString(),
      });
    } else {
      if (!editStudent)
        navigate({
          pathname: location.pathname,
        });
    }
  }, [queryDebounce]);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchUsers(searchParams);
    setEditStudent(null);
  }, [params, update]);

  const handleUpdate = async (data) => {
    console.log("Update Data", data)

    const response = await apiUpdateUserByAdmin(data, editStudent._id);
    console.log(response)
    if (response.success) {
      setEditStudent(null);
      render();
      toast.success(response.mes);
    } else {
      toast.error(response.mes);
    }
  };
  const handleDeleteUser = (uid) => {
    Swal.fire({
      title: "Are you sure...",
      text: "Delete User ?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteUserByAdmin(uid);
        if (response.success) {
          render();
          toast.success(response.mes);
        } else {
          toast.error(response.mes);
        }
      }
    });
  };

  useEffect(() => {
    if (editStudent) {
      setSelectedDepartment(editStudent.department)
      reset({
        firstname: editStudent.firstname,
        lastname: editStudent.lastname,
        codeId: editStudent.codeId,
        email: editStudent.email,
        schoolYear: editStudent.schoolYear,
        department: editStudent.department,
        major: editStudent.major,
        isBlocked: editStudent.isBlocked,
      });
    }

  }, [editStudent]);
  const handleSelect = (data) => {
    setSelectedDepartment(data)
  }
  const fetchDepartment = async () => {
    const response = await apiGetAllDepartment({ limit: 99 });
    if (response.success) setDepartment(response.Departments);
  };
  const fetchMajorByDepartment = async (data) => {
    const response = await apiGetMajorByDepartment(data);
    if (response.success) {
      setMajor(response.data.majors);
    }
  };
  const fetchSchoolYear = async (data) => {
    const response = await apiGetSchoolYears(data);
    if (response.success) {
      setSchoolYear(response.SchoolYears);
    }
  };
  useEffect(() => {
    fetchDepartment()
    fetchSchoolYear()
  }, []);
  useEffect(() => {
    if (selectedDepartment) {
      fetchMajorByDepartment(selectedDepartment);
    }
  }, [selectedDepartment]);


  console.log("Major", Major)
  console.log("Department", Department)
  console.log("Selected Department", selectedDepartment)
  return (
    <div className="w-full flex flex-col gap-4 px-4">
      <div className="p-4 border-b w-full flex items-center ">
        <h1 className="text-3xl font-bold tracking-tight">Manage Student</h1>
      </div>
      <div className="w-full p-4">
        <div className="flex w-full justify-end items-center px-1 pb-4">
          {/* <form className='w-[300px]' onSubmit={handleSubmit(handleManagePitch)}> */}
          <form className="w-[300px] ">
            <InputForm
              id="q"
              register={register}
              errors={errors}
              fullWidth
              transform
              placeholder="Search user by email, name, ..."
            />
          </form>
        </div>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <table className="table-auto w-full ">
            <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="bg-sky-900 text-white py-2">
                <th className="px-4 py-2 text-center h-[60px] w-[45px] rounded-tl-lg">
                  #
                </th>
                <th className="px-4 py-2 text-center h-[80px] w-[100px]">
                  Avatar
                </th>
                <th className="px-4 py-2 text-center h-[60px] w-[120px]">
                  First name
                </th>
                <th className="px-4 py-2 text-center h-[60px] w-[130px]">
                  Last name
                </th>
                <th className="px-4 py-2 text-center h-[60px] w-[10px]">ID</th>
                <th className="px-4 py-2 text-center h-[60px] w-[10px]">
                  Email
                </th>
                <th className="px-4 py-2 text-center h-[60px] w-[10px]">
                  School year
                </th>
                <th className="px-4 py-2 text-center h-[60px] w-[10px]">
                  Department
                </th>
                <th className="px-4 py-2 text-center h-[60px] w-[10px]">
                  Major
                </th>
                <th className="px-4 py-2 text-center h-[60px] w-[130px]">
                  Status
                </th>
                {/* <th>Address</th> */}
                <th className="px-4 py-2 w-[140px] rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {user?.users?.map((el, index) => (
                <tr
                  key={el._id}
                  className='odd:bg-white odd:dark:bg-gray-300 even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700"'
                >
                  <td className="px-6 py-5 text-center">
                    {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                      process.env.REACT_APP_PITCH_LIMIT +
                      index +
                      1}
                  </td>
                  <td className="text-center py-2">
                    <div className="flex items-center justify-center">
                      {el.avatar ? (
                        <img
                          src={el.avatar}
                          alt="thumb"
                          className="w-[40px] h-[40px]  object-fill"
                        />
                      ) : (
                        <img
                          src={defaultImg}
                          alt="avatar"
                          className="w-[40px] h-[40px] object-cover rounded-full"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {editStudent?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id={"firstname"}
                        placeholder="First name"
                        validate={{ required: "Enter your first name" }}
                        txtSmall
                      />
                    ) : (
                      <span>{el.firstname}</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    {editStudent?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id={"lastname"}
                        placeholder="Last name"
                        validate={{ required: "Enter your last name" }}
                        txtSmall
                      />
                    ) : (
                      <span>{el.lastname}</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    {editStudent?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id={"codeId"}
                        placeholder="Student id..."
                        validate={{ required: "Enter your last name" }}
                        txtSmall
                      />
                    ) : (
                      <span>{el.codeId}</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    {editStudent?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id={"email"}
                        placeholder="Email"
                        validate={{
                          required: "Enter your email",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        }}
                        txtSmall
                      />
                    ) : (
                      <span>{el.email}</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    {editStudent?._id === el._id ? (
                      <select
                        id={"schoolYear"}
                        className='form-select text-sm rounded-lg'
                        register={register}
                      >
                        {SchoolYear?.map(el => (
                          el.title === editStudent?.schoolYear
                            ?
                            <option selected="selected" value={el._id}>{el.title}</option>
                            :
                            <option value={el._id}>{el.title}</option>
                        ))}
                      </select>
                    ) : (
                      <span>
                        {el.schoolYear}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5 text-center">
                    {editStudent?._id === el._id ? (
                      <select
                        id={"department"}
                        className='form-select text-sm rounded-lg'
                        register={register}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                      >
                        {Department?.map(el => (
                          el.title === editStudent?.department
                            ?
                            <option selected="selected" value={el.title}>{el.title}</option>
                            :
                            <option value={el.title}>{el.title}</option>
                        ))}
                      </select>
                    ) : (
                      <span>
                        {el.department}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    {editStudent?._id === el._id ? (
                      <select
                        id={"major"}
                        className='form-select text-sm rounded-lg'
                        register={register}
                      >
                        {Major?.map((el, index) => (
                          el === editStudent?.major
                            ?
                            <option selected="selected" value={index}>{el}</option>
                            :
                            <option value={index}>{el}</option>
                        ))}
                      </select>
                    ) : (
                      <span>
                        {el.major}
                      </span>
                    )}
                  </td>
                  {/*
                   * Tìm trong list roles (bên ultili) nếu có thì trả về object nên trỏ tiếp tới value để in
                   */}
                  <td className="px-6 py-5 text-center">
                    {editStudent?._id === el._id ? (
                      <Select
                        register={register}
                        fullWidth
                        errors={errors}
                        id={"isBlocked"}
                        validate={{ required: "Please Select" }}
                        options={blockStatus}
                      />
                    ) : (
                      <span>
                        {
                          blockStatus.find(
                            (status) => status.code === +el.isBlocked
                          )?.value
                        }
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center ">
                      {editStudent?._id === el._id ? (
                        <>
                          <button
                            className="px-2 text-2xl text-green-500 hover:text-green-700 cursor-pointer"
                            type="submit"
                          >
                            <FaSave />
                          </button>
                          <span
                            onClick={() => setEditStudent(null)}
                            className="px-2 text-2xl text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <TiCancel />
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            onClick={() => setEditStudent(el)}
                            className="px-2 text-2xl text-green-500 hover:text-green-700 cursor-pointer"
                          >
                            <FaRegEdit />
                          </span>
                          <span
                            onClick={() => handleDeleteUser(el._id)}
                            className="px-2 text-2xl text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <MdDeleteForever />
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>

        <div className="w-full flex justify-end mt-2">
          <Pagination totalCount={user?.counts} type="users" />
        </div>
      </div>
    </div>
  );
};

export default ManageStudent;
