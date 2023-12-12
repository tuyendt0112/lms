import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'
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
  DetailBrand
} from 'pages/public'
import {
  AdminLayout,
  CreatePitch,
  DashBoard,
  ManageOrder,
  ManagePitch,
  ManageUser,
  ManageBrands,
  ManageCategory,
  CreateBrands,
  CreateCategory
} from 'pages/admin'
import {
  MemberLayout,
  Personal,
  History,
  Wishlist
} from 'pages/member'
import { PitchOwnerLayout, ManagePitchOwn, PersonalOwn, CreatePitchOwn, CreateOwnerBrand, ManageOwnerOrder } from 'pages/pitchowner'
import path from 'ultils/path'
import { getCategories } from 'store/app/asyncAction'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { Modal, Order } from 'components';
import { showOrder } from 'store/app/appSilice';
import DetailOrder from 'pages/public/DetailOrder';
import Checkout from 'pages/member/CheckOut';
import 'react-toastify/dist/ReactToastify.css'
function App() {
  const dispatch = useDispatch()
  const { isShowModal, modalChildren, isShowOrder } = useSelector(
    (state) => state.app
  );
  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])
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
        theme='colored'
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
          <Route path={path.DETAIL_PITCH__CATEGORY__BRAND__PITCHID__TITLE} element={<DetailPitches />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.OUR_SERVICE} element={<Services />} />
          <Route path={path.PITCHES__CATEGORY} element={<Pitches />} />
          <Route path={path.DETAIL_ORDER} element={<DetailOrder />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={path.ALL} element={<Home />} />
          <Route path={path.CATEGORY__BRAND} element={<DetailBrand />} />
        </Route>
        {/*Admin Route*/}
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.CREATE_PITCH} element={<CreatePitch />} />
          <Route path={path.DASHBOARD} element={<DashBoard />} />
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
          <Route path={path.MANAGE_PITCH} element={<ManagePitch />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
          <Route path={path.MANAGE_CATEGORY} element={<ManageCategory />} />
          <Route path={path.MANAGE_BRANDS} element={<ManageBrands />} />
          <Route path={path.CREATE_CATEGORY} element={<CreateCategory />} />
          <Route path={path.CREATE_BRANDS} element={<CreateBrands />} />
        </Route>
        {/*Member Route*/}
        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />} />
          <Route path={path.HISTORY} element={<History />} />
          <Route path={path.WISHLIST} element={<Wishlist />} />
        </Route>
        {/*PitchOwner Route*/}
        <Route path={path.PITCHOWNER} element={<PitchOwnerLayout />}>
          <Route path={path.MANAGE_PITCHOWN} element={<ManagePitchOwn />} />
          <Route path={path.CREATE_PITCHOWN} element={<CreatePitchOwn />} />
          <Route path={path.CREATE_BRAND_PITCHOWNER} element={<CreateOwnerBrand />} />
          <Route path={path.MANAGE_ORDER_PITCHOWNER} element={<ManageOwnerOrder />} />
        </Route>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.LOGIN} element={<Login />}></Route>
      </Routes>
    </div>
  );
}

export default App;