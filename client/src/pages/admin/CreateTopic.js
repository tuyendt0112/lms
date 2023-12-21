// import React, { useCallback, useEffect, useState } from "react";
// import { Button, InputForm, MarkDownEditor, Loading } from "components";
// import { useForm } from "react-hook-form";
// import { useSelector, useDispatch } from "react-redux";
// import { validate, getBase64 } from "ultils/helper";
// import { toast } from "react-toastify";
// import { apiCreatePitch, apiGetUsers, apiGetBrandByOwner } from "apis";
// import { showModal } from "store/app/appSilice";
// import Select from "react-select";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import icons from "ultils/icons";
// const CreatePitch = () => {
//   const { FaCalendarAlt } = icons;
//   const dispatch = useDispatch();
//   const [Users, setUsers] = useState(null);
//   const [Major, setMajor] = useState(null);
//   const [Department, setDepartment] = useState(null);
//   const {
//     register,
//     formState: { errors },
//     reset,
//     handleSubmit,
//     watch,
//   } = useForm();

//   const handleCreatePitch = async (data) => {
//     const invalids = validate(payload, setInvalidFields);
//     if (invalids === 0) {
//       const finalPayload = {
//         ...data,
//         ...payload,
//         owner: selectedOwner,
//         category: selectedCategories,
//         brand: selectedBrand?.title,
//       };
//       console.log(finalPayload);
//       const formData = new FormData();
//       for (let i of Object.entries(finalPayload)) {
//         formData.append(i[0], i[1]);
//       }
//       if (finalPayload.thumb) {
//         formData.append("thumb", finalPayload.thumb[0]);
//       }
//       if (finalPayload.images) {
//         for (let image of finalPayload.images) formData.append("images", image);
//       }
//       dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
//       window.scrollTo(0, 0);
//       const response = await apiCreatePitch(formData);
//       dispatch(showModal({ isShowModal: false, modalChildren: null }));
//       if (response.success) {
//         reset();
//         setPayload({
//           description: "",
//         });
//         setPreview({
//           thumb: null,
//           images: [],
//         });

//         toast.success("Create Pitch Success !");
//       } else {
//         toast.error("Fail!!!");
//       }
//       //   }
//     }
//   };
//   const [selectedOwner, setSelectedOwner] = useState(null);
//   const [payload, setPayload] = useState({
//     description: "",
//   });

//   const [invalidFields, setInvalidFields] = useState([]);
//   const changeValue = useCallback(
//     (e) => {
//       setPayload(e);
//     },
//     [payload]
//   );

//   const fetchUsers = async () => {
//     const response = await apiGetUsers({ limit: 99 });
//     if (response.success) setUsers(response.users);
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);
//   useEffect(() => {
//     if (selectedOwner) {
//       fetchBrandOwner(selectedOwner);
//     }
//   }, [selectedOwner]);

//   const fetchBrandOwner = async (id) => {
//     const response = await apiGetBrandByOwner(id);
//     if (response.success) {
//       setSelectedBrand(response.brandData);

//       setCate(response.brandData.categories);
//     }
//   };

//   return (
//     <div className="w-full flex flex-col gap-4 px-4 ">
//       <div className="p-4 border-b w-full flex items-center ">
//         <h1 className="text-3xl font-bold tracking-tight">Create Pitch</h1>
//       </div>
//       <div className="p-4">
//         <form onSubmit={handleSubmit(handleCreatePitch)}>
//           <div className="w-full py-5 ">
//             <InputForm
//               label="Title of Topic"
//               register={register}
//               errors={errors}
//               id="title"
//               validate={{
//                 required: "Need to be fill",
//               }}
//               fullWidth
//               style="flex-1"
//               placeholder="Title of new Topic"
//             />
//           </div>
//           <div className="w-full py-5 ">
//             <InputForm
//               label="ID of Topic"
//               register={register}
//               errors={errors}
//               id="topicId"
//               validate={{
//                 required: "Need to be fill",
//               }}
//               fullWidth
//               style="flex-1"
//               placeholder="ID of new Topic"
//             />
//           </div>
//           <div className="w-full pt-10 pb-5 flex items-center gap-4">
//             <div className="flex-1 items-center">
//               <h2 className="font-bold">Department:</h2>
//               <Select
//                 maxMenuHeight={150}
//                 label="Department"
//                 options={Users?.map((el) => ({
//                   code: el._id,
//                   label: `${el.firstname} ${el.lastname}`,
//                 }))}
//                 id="department"
//                 placeholder={"Select Department"}
//                 onChange={(selectedOptions) => {
//                   setSelectedOwner(selectedOptions.code);
//                 }}
//                 errors={errors}
//               />
//             </div>
//             <div className="flex-1 items-center">
//               <h2 className="font-bold">Major:</h2>
//               <Select
//                 maxMenuHeight={150}
//                 label="Major"
//                 options={Cate?.map((el) => ({
//                   code: el,
//                   label: el,
//                 }))}
//                 id="major"
//                 onChange={(selectedOptions) => {
//                   setSelectedCategories(selectedOptions.label);
//                 }}
//               />
//             </div>
//           </div>

//           <div className="flex-1 items-center">
//             <h2 className="font-semibold">Date Start:</h2>
//             <div className="w-full pb-5 flex-1 gap-4">
//               <FaCalendarAlt className="mr-2" />

//               <DatePicker
//                 // selected={selectedDate}
//                 // onChange={(date) => setSelectedDate(date)}
//                 dateFormat="dd/MM/yyyy"
//                 minDate={new Date()}
//                 placeholderText="Select Date Book"

//                 // className="w-full border-none outline-none"
//                 // popperClassName="datepicker-popper"
//               />
//             </div>
//             <h2 className="font-semibold">Date Start:</h2>
//             <div className="w-full pb-5 flex-1 gap-4">
//               <FaCalendarAlt className="mr-2" />
//               <DatePicker
//                 // selected={selectedDate}
//                 // onChange={(date) => setSelectedDate(date)}
//                 dateFormat="dd/MM/yyyy"
//                 minDate={new Date()}
//                 placeholderText="Select Date Book"

//                 // className="w-full border-none outline-none"
//                 // popperClassName="datepicker-popper"
//               />
//             </div>
//             <div></div>
//           </div>

//           <div className="w-full pt-10">
//             <MarkDownEditor
//               name="description"
//               changeValue={changeValue}
//               label="Description"
//               invalidFields={invalidFields}
//               setInvalidFields={setInvalidFields}
//             />
//           </div>

//           <div className="my-8">
//             <Button type="submit">Create new pitch</Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreatePitch;
import React from "react";

const CreateTopic = () => {
  return <div>CreateTopic</div>;
};

export default CreateTopic;
