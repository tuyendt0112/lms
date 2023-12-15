import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
    <div className="w-full">
      <ResponsiveContainer width={300} height={300}>
        <AreaChart data={generateMonthlyChartData()} margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" style={{
            fill: 'rgba(255,255,255)'
          }} />
          <YAxis style={{
            fill: 'rgba(255,255,255)'
          }} />
          <Tooltip />
          <Legend />

          <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>

  );
};
export default AreaChartMonth;
