import React, { memo, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiDeleteOrder, apiGetUserOrderStatus } from "apis";
import defaultImage from "assets/default.png";
import { shifts } from "ultils/constant";
import { formatMoney } from "ultils/helper";
import { Button } from "components";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import path from "ultils/path";
import { showOrder } from "store/app/appSilice";
const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current } = useSelector((state) => state.user);
  const [order, setOrder] = useState(null);
  const fetchPitchData = async () => {
    const response = await apiGetUserOrderStatus(current?._id);
    if (response.success) setOrder(response.Booking);
  };

  const updateOrder = async (bid) => {
    const response = await apiDeleteOrder(bid);
    if (response.success) {
      fetchPitchData();
      toast.success(response.message);
    } else toast.error(response.message);
  };
  useEffect(() => {
    fetchPitchData();
  }, []);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-[420px] max-h-screen overflow-y-auto bg-black grid grid-rows-10 text-white p-6"
    >
      <header className=" border-b border-gray-500 flex justify-between row-span-1 h-full items-center font-bold text-2xl">
        <span>Your Order </span>
        <span
          onClick={() => dispatch(showOrder())}
          className="p-2 cursor-pointer"
        >
          <IoMdClose />
        </span>
      </header>
      <section className="row-span-5 flex flex-col gap-3 h-full max-h-full overflow-y-auto py-3">
        {(!order || order.length === 0) && (
          <span className="text-xs italic">Your Order is Empty</span>
        )}
        {order &&
          order?.map((el) => (
            <div className="flex justify-between items-center" key={el._id}>
              <div className="flex gap-2">
                <img
                  src={el.pitch?.thumb || defaultImage}
                  alt="thumb"
                  className="w-16 h-16 object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-main text-[15px]">
                    {el.pitch?.name}
                  </span>
                  <span className="text-base ">
                    {formatMoney(el.pitch?.price) + ` VND`}
                  </span>
                  <span className="text-xs">
                    {shifts.find((s) => s.value === +el.shift)?.time}
                  </span>
                </div>
              </div>
              <span
                onClick={() => updateOrder(el._id)}
                className="h-8 w-8 rounded-full flex items-center hover:bg-gray-700 cursor-pointer"
              >
                <MdDeleteForever size={16} />
              </span>
            </div>
          ))}
      </section>
      <div className="row-span-2 flex flex-col justify-between h-full">
        <div className="flex items-center m-4 justify-between pt-4 border-t">
          <span> Subtotal:</span>
          <span>
            {formatMoney(
              order?.reduce((sum, el) => sum + Number(el.pitch?.price), 0)
            ) + ` VND`}
          </span>
        </div>
        <span className="text-center text-gray-700 italic">
          Taxes and Discount calculated at checkout
        </span>
        <Button
          handleOnClick={() => {
            dispatch(showOrder());
            navigate(`${path.DETAIL_ORDER}`);
          }}
          style="rounded-none w-full bg-main py-3"
        >
          Check out Detail
        </Button>
      </div>
    </div>
  );
};

export default memo(Order);
