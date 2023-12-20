// import React, { useCallback, useEffect, useState } from "react";
// import { InputForm, Pagination } from "components";
// import { useForm } from "react-hook-form";
// import { apiGetAllBrands, apiDeleteBrand, apiGetAllMajor } from "apis";
// import defaultt from "assets/default.png";
// import moment from "moment";
// import icons from "ultils/icons";
// import {
//   useSearchParams,
//   createSearchParams,
//   useNavigate,
//   useLocation,
// } from "react-router-dom";
// import useDebounce from "hooks/useDebounce";
// import UpdatePitch from "pages/admin/UpdatePitch";
// import Swal from "sweetalert2";
// import { toast } from "react-toastify";
// import { formatMoney, formatPrice } from "ultils/helper";
// import UpdateBrand from "./UpdateBrand";
// import { FaRegEdit } from "react-icons/fa";

// const { AiFillStar, MdEdit, MdDeleteForever } = icons;
// const ManageMajor = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [params] = useSearchParams();
//   const {
//     register,
//     formState: { errors },
//     watch,
//   } = useForm();
//   const [brands, setBrands] = useState(null);
//   const [majors, setMajors] = useState(null);
//   const [counts, setCounts] = useState(0);
//   const [editBrand, setEditBrand] = useState(null);
//   const [update, setUpdate] = useState(false);

//   const render = useCallback(() => {
//     setUpdate(!update);
//   });
//   const fetchMajor = async (params) => {
//     console.log("HELLo");
//     const response = await apiGetAllMajor({
//       ...params,
//       limit: process.env.REACT_APP_PITCH_LIMIT,
//     });
//     console.log("CHECK");
//     if (response.success) {
//       console.log(response);
//       setMajors(response?.Majors);
//       setCounts(response?.totalCount);
//     }
//   };

//   const queryDebounce = useDebounce(watch("q"), 800);
//   // const queryDecounce = useDebounce(queries.q, 500)
//   useEffect(() => {
//     if (queryDebounce) {
//       navigate({
//         pathname: location.pathname,
//         search: createSearchParams({ q: queryDebounce }).toString(),
//       });
//     } else {
//       navigate({
//         pathname: location.pathname,
//       });
//     }
//   }, [queryDebounce]);

//   useEffect(() => {
//     const searchParams = Object.fromEntries([...params]);
//     fetchMajor(searchParams);
//   }, [params, update]);

//   const handleDeleteBrand = (bid) => {
//     Swal.fire({
//       title: "Are you sure",
//       text: "Sure friends ?",
//       icon: "warning",
//       showCancelButton: true,
//     }).then(async (rs) => {
//       if (rs.isConfirmed) {
//         const response = await apiDeleteBrand(bid);
//         if (response?.success) toast.success(response?.message);
//         else toast.error(response?.message);
//         render();
//       }
//     });
//   };
//   return (
//     <div className="w-full flex flex-col gap-4 px-4 relative">
//       {editBrand && (
//         <div className="absolute inset-0 win-h-screen bg-gray-100 z-50">
//           <UpdateBrand
//             editBrand={editBrand}
//             render={render}
//             setEditBrand={setEditBrand}
//           />
//         </div>
//       )}
//       <div className="p-4 border-b w-full  flex justify-between items-center ">
//         <h1 className="text-3xl font-bold tracking-tight">Manage Major</h1>
//       </div>
//       <div className="flex w-full justify-end items-center px-1">
//         {/* <form className='w-[300px]' onSubmit={handleSubmit(handleManagePitch)}> */}
//         <form className="w-[300px]">
//           <InputForm
//             id="q"
//             register={register}
//             errors={errors}
//             fullWidth
//             transform
//             placeholder="Search products by title, address ..."
//           />
//         </form>
//       </div>
//       <table className="table-auto w-full ">
//         <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//           <tr className="bg-sky-900 text-white  py-2">
//             <th className="px-4 py-2 text-center rounded-tl-lg">#</th>
//             <th className="px-4 py-2 text-center ">Title</th>
//             <th className="px-4 py-2 text-center h-[60px]  ">Department</th>
//             <th className="px-4 py-2 text-center h-[60px]  ">Create At</th>
//             <th className="px-4 py-2 text-center  h-[60px] rounded-tr-lg">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {majors?.map((el, index) => (
//             <tr
//               className='odd:bg-white odd:dark:bg-gray-300 even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700"'
//               key={el._id}
//             >
//               <td className="text-center p ">
//                 {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
//                   process.env.REACT_APP_PITCH_LIMIT +
//                   index +
//                   1}
//               </td>

//               <td className="text-center py-2">{el.title}</td>

//               <td className="text-center py-2">
//                 <div className="flex flex-col items-center justify-center">
//                   {el.department.map((category, index) => (
//                     <sm key={index + 1}>{category}</sm>
//                   ))}
//                 </div>
//               </td>

//               <td className="text-center py-2">
//                 {moment(el.createdAt).format("DD/MM/YYYY")}
//               </td>
//               <td className="text-center py-2 ">
//                 <div className="flex items-center justify-center ">
//                   <span
//                     className="px-2 text-2xl text-green-500 hover:text-green-700 cursor-pointer"
//                     onClick={() => setEditBrand(el)}
//                   >
//                     <FaRegEdit />
//                   </span>
//                   <span
//                     onClick={() => handleDeleteBrand(el._id)}
//                     className="px-2 text-2xl text-red-500 hover:text-red-700 cursor-pointer"
//                   >
//                     <MdDeleteForever />
//                   </span>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="w-full flex justify-end my-8">
//         <Pagination totalCount={counts} type="majors" />
//       </div>
//     </div>
//   );
// };

// export default ManageMajor;

import React from "react";

const ManageMajor = () => {
  return <div>ManageMajor</div>;
};

export default ManageMajor;
