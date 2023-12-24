import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Login,
  Home,
  Public,
  FAQ,
  Services,
  DetailPitches,
  Blog,
  Pitches,
  FinalRegister,
  ResetPassword,
  DetailBrand,
  Notification,
  Instruction,
  Topics,
  Lecturers,
  DetailNotification
} from "pages/public";
import {
  AdminLayout,
  ManageStudent,
  ManageDepartment,
  ManageMajor,
  CreateDepartment,
  CreateMajor,
  CreateStudent,
  CreateTopic,
  ManageTopic,
  CreateSchoolYear,
  ManageSchoolYear,
  CreateLecturer,
  ManageLecturer,
  CreateNotification,
  ManageNotification,
} from "pages/admin";
import {
  CreateTopicHeadTeacher,
  HeadTeacherLayout,
  ManageTopicHeadTeacher,
  UpdateTopicHeadTeacher,
  VerifyTopicHeadTeacher
} from "pages/headteacher";

import { MemberLayout, Personal, History, Wishlist } from "pages/member";
import {
  PitchOwnerLayout,
  ManagePitchOwn,
  CreatePitchOwn,
  CreateOwnerBrand,
  ManageOwnerOrder,
  DashboardOwner,
} from "pages/pitchowner";
import path from "ultils/path";
import { getCategories } from "store/app/asyncAction";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Modal, Order, Pitch } from "components";
import { showOrder } from "store/app/appSilice";
import DetailOrder from "pages/public/DetailOrder";
import Checkout from "pages/member/CheckOut";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const dispatch = useDispatch();
  const { isShowModal, modalChildren, isShowOrder } = useSelector(
    (state) => state.app
  );
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  return (
    <div className="font-main h-screen">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        limit={3}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {isShowOrder && (
        <div
          onClick={() => dispatch(showOrder())}
          className="absolute inset-0 bg-overlay z-50 flex justify-end"
        >
          <Order />
        </div>
      )}
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        {/*Public Route*/}
        <Route path={path.CHECKOUT} element={<Checkout />} />
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blog />} />
          <Route path={path.NOTIFICATION} element={<Notification />} />
          <Route path={path.INSTRUCTION} element={<Instruction />} />
          <Route path={path.TOPIC} element={<Topics />} />
          <Route path={path.LECTURER} element={<Lecturers />} />
          <Route path={path.DETAIL_PITCH__CATEGORY__BRAND__PITCHID__TITLE} element={<DetailPitches />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.OUR_SERVICE} element={<Services />} />
          <Route path={path.DETAIL_NOTIFICATION} element={<DetailNotification />} />
          {/* <Route path={path.PITCHES__CATEGORY} element={<Pitches />} /> */}
          <Route path={path.DETAIL_ORDER} element={<DetailOrder />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={path.ALL} element={<Home />} />
          <Route path={path.CATEGORY__BRAND} element={<DetailBrand />} />
        </Route>
        {/*Admin Route*/}
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.CREATE_STUDENT} element={<CreateStudent />} />
          <Route path={path.MANAGE_STUDENT} element={<ManageStudent />} />
          <Route path={path.CREATE_LECTURER} element={<CreateLecturer />} />
          <Route path={path.MANAGE_LECTURER} element={<ManageLecturer />} />
          <Route path={path.CREATE_TOPIC} element={<CreateTopic />} />
          <Route path={path.MANAGE_TOPIC} element={<ManageTopic />} />
          <Route path={path.CREATE_NOTIFICATION} element={<CreateNotification />} />
          <Route path={path.MANAGE_NOTIFICATION} element={<ManageNotification />} />
          <Route path={path.CREATE_SCHOOLYEAR} element={<CreateSchoolYear />} />
          <Route path={path.MANAGE_SCHOOLYEAR} element={<ManageSchoolYear />} />
          <Route path={path.CREATE_DEPARTMENT} element={<CreateDepartment />} />
          <Route path={path.MANAGE_DEPARTMENT} element={<ManageDepartment />} />
          <Route path={path.CREATE_MAJOR} element={<CreateMajor />} />
          <Route path={path.MANAGE_MAJOR} element={<ManageMajor />} />
        </Route>
        {/*Head Teacher Route*/}
        <Route path={path.HEADERTEACHER} element={<HeadTeacherLayout />}>
          <Route path={path.CREATE_TOPIC_HEADTEACHER} element={<CreateTopicHeadTeacher />} />
          <Route path={path.MANAGE_TOPIC_HEADTEACHER} element={<ManageTopicHeadTeacher />} />
          <Route path={path.VERIFY_TOPIC_HEADTEACHER} element={<VerifyTopicHeadTeacher />} />
        </Route>
        {/*Member Route*/}
        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />} />
          <Route path={path.HISTORY} element={<History />} />
          <Route path={path.WISHLIST} element={<Wishlist />} />
        </Route>
        {/*PitchOwner Route*/}
        <Route path={path.PITCHOWNER} element={<PitchOwnerLayout />}>
          <Route path={path.DASHBOARD_PITCHOWN} element={<DashboardOwner />} />
          <Route path={path.MANAGE_PITCHOWN} element={<ManagePitchOwn />} />
          <Route path={path.CREATE_PITCHOWN} element={<CreatePitchOwn />} />
          <Route
            path={path.CREATE_BRAND_PITCHOWNER}
            element={<CreateOwnerBrand />}
          />
          <Route
            path={path.MANAGE_ORDER_PITCHOWNER}
            element={<ManageOwnerOrder />}
          />
        </Route>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.LOGIN} element={<Login />}></Route>
      </Routes>
    </div>
  );
}

export default App;
