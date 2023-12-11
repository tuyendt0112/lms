import React, { memo, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import withBase from "hocs/withBase";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiGetUserOrder, apiGetUserOrderStatus } from "apis";
import defaultImage from "assets/default.png";
import { shifts } from "ultils/constant";
import { formatMoney, convertToTitleCase } from "ultils/helper";
import { Breadcrumb, Button } from "components";
import path from "ultils/path";

const DetailOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { current } = useSelector((state) => state.user);
  const [order, setOrder] = useState(null);
  const [orderChanged, setOrderChanged] = useState(false);
  const fetchPitchData = async () => {
    const response = await apiGetUserOrderStatus(current?._id);
    if (response.success) {
      setOrder(response.Booking);
      setOrderChanged(false);
    }

    // console.log(response.Booking);
  };

  useEffect(() => {
    fetchPitchData();
  }, [orderChanged, order]);

  return (
    <div className="w-full">
      <div className="h-[81px] flex justify-center items-center bg-gray-100">
        <div className="w-main">
          <h3 className="font-semibold uppercase">My Order </h3>
          <Breadcrumb category={convertToTitleCase(location?.pathname)} />
        </div>
      </div>
      <div className="flex flex-col border my-8 w-main mx-auto">
        <div className="w-main mx-auto bg-gray-200  font-bold  py-3 grid grid-cols-10">
          <span className="col-span-6 w-full text-center">Pitches </span>
          <span className="col-span-1 w-full text-center">Shift </span>
          <span className="col-span-3 w-full text-center">Price </span>
        </div>
        {order?.map((el) => (
          <div
            key={el._id}
            className="w-main mx-auto font-bold border-b py-3 grid grid-cols-10"
          >
            <div>
              <img
                src={el.pitch?.thumb || defaultImage}
                alt="thumb"
                className="w-40 h-28 object-cover ml-5"
              />
            </div>
            <span className="col-span-4 w-full flex items-center justify-center">
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 items-center justify-center">
                  <span className="text-main text-xl">{el.pitch?.title}</span>
                  <span className="text-md">{el.pitch?.category}</span>
                  <span className="text-md">{el.pitch?.address}</span>
                </div>
              </div>
            </span>
            <span className="col-span-3 w-full h-full flex items-center justify-center text-center">
              <span className="text-xl ">
                {shifts.find((s) => s.value === +el.shift)?.time}
              </span>
            </span>
            <span className="col-span-1 w-full h-full flex items-center justify-center text-center">
              <span className="text-xl ">
                {formatMoney(el.pitch?.price) + ` VND`}
              </span>
            </span>
          </div>
        ))}
      </div>
      <div className="w-main mx-auto flex flex-col mb-12 justify-center gap-3 items-end">
        <span className="flex items-center gap-8 text-sm">
          <span>Subtotal:</span>
          <span className="text-main">
            {formatMoney(
              order?.reduce((sum, el) => sum + Number(el.pitch?.price), 0)
            ) + ` VND`}
          </span>
        </span>
        <span className="text-xs italic">
          taxes and discount calculated at check out form
        </span>
        <div className="flex gap-3 ">
          <Button
            // className="bg-main text-white px-4 py-2 rounded-md inline-block"
            handleOnClick={() => {
              navigate(`/${path.HOME}`);
            }}
          >
            Book Other
          </Button>

          <Link
            className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 shadow-lg shadow-rose-700/100 hover:shadow-rose-700/70 text-white px-4 py-2 rounded-md text-center w-[112px] h-[42px] "
            target="_blank"
            to={`/${path.CHECKOUT}`}
            onClick={() => setOrderChanged(true)}
          >
            Check Out
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(DetailOrder);
