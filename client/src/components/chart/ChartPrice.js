import React, { useEffect, useState } from "react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ChartPrice = ({ order }) => {
  const getMonthString = (date) => {
    const options = { month: "long" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };
  const generateMonthlyRevenueChartData = () => {
    const monthlyRevenueData = {};

    // Lặp qua mỗi đơn đặt sân và tạo dữ liệu tổng doanh thu theo tháng
    order?.forEach((orderItem) => {
      const monthKey = getMonthString(new Date(orderItem.bookedDate));
      if (monthlyRevenueData[monthKey]) {
        monthlyRevenueData[monthKey] += Number(orderItem.total);
      } else {
        monthlyRevenueData[monthKey] = Number(orderItem.total);
      }
    });

    // Chuyển đổi dữ liệu thành mảng để sử dụng trong biểu đồ
    const chartData = Object.keys(monthlyRevenueData).map((month) => ({
      month,
      revenue: monthlyRevenueData[month],
    }));

    return chartData;
  };

  return (
    <ResponsiveContainer width={300} height={300}>
      <BarChart data={generateMonthlyRevenueChartData()} margin={{
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
        <Bar dataKey="revenue" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};
export default ChartPrice;
