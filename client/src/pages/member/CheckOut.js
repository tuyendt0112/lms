import paypal from "assets/paypal.png";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { apiGetUserOrderStatus, apiStatusOrder } from "apis";
import { shifts } from "ultils/constant";
import { formatMoney } from "ultils/helper";

import { Paypal, Congratulation, Button } from "components";
import Swal from "sweetalert2";
import { FaMoneyBillWave } from "react-icons/fa";


const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current } = useSelector((state) => state.user);
  const [order, setOrder] = useState(null);
  // const [orderIds, setOrderIds] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showCashButton, setShowCashButton] = useState(false);

  const fetchPitchData = async () => {
    const response = await apiGetUserOrderStatus(current?._id);
    if (response.success) setOrder(response.Booking);
  };
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setShowCashButton(!showCashButton);
  };
  useEffect(() => {
    // Thực hiện các hành động cần thiết khi trạng thái của checkbox thay đổi
  }, [isChecked, showCashButton]);
  const handlePayByCash = async () => {
    const status = "Pay By Cash";
    let successCount = 0;
    for (const _id of order) {
      const response = await apiStatusOrder({ _id: _id, status: status });
      console.log(response);
      if (response.success) {
        successCount++;
      }
    }
    if (successCount === order.length) {
      // Nếu tất cả responses thành công, đóng cửa sổ
      setIsSuccess(true);
      setTimeout(() => {
        Swal.fire("Congratulate", "Cash Success", "Success").then(() => {
          window.close();
        });
      }, 500);
    }
  };
  useEffect(() => {
    fetchPitchData();
  }, []);
  useEffect(() => {
    // const orderIds = order?.map((item) => ({ id: item._id }));
    // setOrderIds(orderIds);
  }, [order]);
  return (
    <div className=" flex flex-col py-8 w-full  h-full max-h-screen overflow-y-auto gap-6 bg-gray-100">
      {isSuccess && <Congratulation />}
      <div className="w-[full] flex justify-center items-center ">
        <img src={paypal} alt="" className="h-[200px] object-contain" />
      </div>
      <div className="flex w-full flex-col items-center gap-6">
        <h2 className="text-2xl font-bold">Check Out Your Order</h2>
        <table className="table-auto w-[750px]">
          <thead>
            <tr className="border bg-gray-200 ">
              <th className="text-left p-2">Pitches</th>
              <th className="text-center p-2">Shift</th>
              <th className="text-right p-2 ">Price</th>
            </tr>
          </thead>
          <tbody>
            {order?.map((el) => (
              <tr className="border" key={el._id}>
                <td className="text-left p-2">{el.pitch?.title}</td>
                <td className="text-center p-2">
                  {shifts.find((s) => s.value === +el.shift)?.time}
                </td>
                <td className="text-right p-2">
                  {formatMoney(el.pitch?.price) + ` VND`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <span className="flex items-center gap-8 text-3xl font-semibold">
            <span>Subtotal:</span>
            <span className="text-main text-3xl font-semibold">
              {formatMoney(
                order?.reduce((sum, el) => sum + Number(el.pitch?.price), 0)
              ) + ` VND`}
            </span>
          </span>
        </div>
        <div className="flex flex-col w-full justify-center items-center">
          <button className="bg-green-700 w-[200px] h-[35px] rounded-md font-bold flex items-center justify-center m-3 text-white hover:text-green-800 hover:bg-green-300 duration-300 " onClick={() => handlePayByCash()}>
            <span className="italic ">Pay By Cash</span>
            <FaMoneyBillWave className="ml-2" />
          </button>

          <Paypal
            payload={{ order: order }}
            setIsSuccess={setIsSuccess}
            amount={Math.round(
              order?.reduce((sum, el) => sum + Number(el.pitch?.price), 0) /
              23500
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
