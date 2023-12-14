import {
  Piechart,
  NewDashBoard,
  Barchart,
  Chart,
  AreaChartMonth,
  ChartPrice,
} from "components";
import { formatMoney, formatPrice } from "ultils/helper";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { apiGetAllOrderPitchOwner } from "apis";

const DashboardOwner = () => {
  const [order, setOrder] = useState(null);
  const [counts, setCounts] = useState(0);
  const { current } = useSelector((state) => state.user);
  const fetchOrderData = async (params) => {
    const response = await apiGetAllOrderPitchOwner({
      owner: current?._id,
      ...params,
    });
    if (response.success) {
      setOrder(response.Bookings);
      setCounts(response.totalCount);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);
  return (
    <div>
      <NewDashBoard></NewDashBoard>
      <div className="w-full flex flex-col items-center ">
        <div>
          {/* <Piechart></Piechart>
            {/* <Chart /> */}
          {/* <Barchart /> */}
        </div>

        <div>
          <AreaChartMonth order={order} />
        </div>
        <div>
          <ChartPrice order={order} />
        </div>
        <div>
          <span>Total Profit: </span>
          <span className="text-main text-3xl font-semibold">
            {formatMoney(
              formatPrice(order?.reduce((sum, el) => sum + Number(el.total), 0))
            ) + "VND"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardOwner;
