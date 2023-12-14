import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AreaChartMonth = ({ order }) => {
  const getMonthString = (date) => {
    const options = { month: "long" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };
  const generateMonthlyChartData = () => {
    const monthlyData = {};

    // Lặp qua mỗi đơn đặt sân và tạo dữ liệu thống kê theo tháng
    order?.forEach((orderItem) => {
      const monthKey = getMonthString(new Date(orderItem.bookedDate));
      if (monthlyData[monthKey]) {
        monthlyData[monthKey] += 1;
      } else {
        monthlyData[monthKey] = 1;
      }
    });

    // Chuyển đổi dữ liệu thành mảng để sử dụng trong biểu đồ
    const chartData = Object.keys(monthlyData).map((month) => ({
      month,
      count: monthlyData[month],
    }));

    return chartData;
  };

  return (
    <ResponsiveContainer width={300} height={300}>
      <AreaChart data={generateMonthlyChartData()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default AreaChartMonth;
