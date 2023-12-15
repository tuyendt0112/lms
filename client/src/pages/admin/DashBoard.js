import {
  Piechart,
  NewDashBoard,
  Barchart,
  Chart,
  AreaChartMonth,
  ChartPrice,
  Piechartbrand,
  PiechartCategory,
} from "components";
import { formatMoney, formatPrice } from "ultils/helper";
import React, { useEffect, useState } from "react";
import { apiGetOrderByAdmin, apiGetAllBrands } from "apis";

const Dashboard = () => {
  const [order, setOrder] = useState(null);
  const [brand, setBrand] = useState(null)
  const [counts, setCounts] = useState(0);

  const fetchOrderData = async () => {
    const response = await apiGetOrderByAdmin();
    if (response.success) {
      setOrder(response.allOrder);
      console.log(order)
    }
  };

  const fetchBrandDate = async () => {
    const response = await apiGetAllBrands({ limit: 9999 });
    if (response.success) {
      setBrand(response);
      console.log("CHECK", brand)
    }
  };

  useEffect(() => {
    fetchOrderData();
    fetchBrandDate()
  }, []);

  return (
    <div>
      <NewDashBoard />
      <div className="w-full flex items-center justify-center gap-2 py-2">
        <div className="flex-1">
          <Piechart />
        </div>
        <div className="flex-1">
          <PiechartCategory />
        </div>
      </div>
      <div className="w-full flex items-center justify-center gap-2 py-2">
        <div className="flex-1 bg-white">
          <AreaChartMonth order={order} />
        </div>
        <div className="flex-1 bg-white">
          <ChartPrice order={order} />
        </div>
      </div>
      <div className="w-full flex items-center justify-center py-2">
        <div className=" bg-white">
          <Barchart brand={brand} />
        </div>
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
  );
};

export default Dashboard;
