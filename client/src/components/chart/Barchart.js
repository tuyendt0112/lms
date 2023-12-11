import React, { useEffect, useState } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiGetPitches, apiGetUsers, apiGetAllOrder } from 'apis'


const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

const Barchart = () => {
    const [pitches, setpitches] = useState(null)
    const [user, setuser] = useState(null)
    const [order, setorder] = useState(null)


    const fetchProducts = async () => {
        const response = await apiGetPitches()
        if (response.success) setpitches(response)
    }
    const fetchUsers = async () => {
        const response = await apiGetUsers()
        if (response.success) setuser(response)
    }
    const fetchOrders = async () => {
        const response = await apiGetAllOrder()
        console.log(response)
        if (response.success) setorder(response)
    }



    useEffect(() => {
        fetchProducts()
        fetchUsers()
        fetchOrders()
    }, [])
    const transactions = [
        { amount: 42, text: "", bookedDate: "2021-04-16T08:52:24.408Z", type: "Expense", category: "Car", id: "dda58c24-92fc-431f-a4eb-d89fad5cdf81" },
        { amount: 3000, text: "", bookedDate: "2021-04-14T19:30:00.000Z", type: "Income", category: "Salary", id: "915db4d8-1b20-4455-be06-c50b15920ae8" },
        { amount: 2997, text: "", bookedDate: "2021-03-17T20:30:00.000Z", type: "Income", category: "Salary", id: "ec1608b1-dc4f-428d-9d41-006322b2cf78" },
        { amount: 19993, text: "", bookedDate: "2021-02-01T20:30:00.000Z", type: "Income", category: "Salary", id: "5f51a268-4d68-4407-87f2-3156d27d5084" },
        { amount: 1000, text: "", bookedDate: "2021-01-06T20:30:00.000Z", type: "Expense", category: "Salary", id: "554b0776-8fad-46da-9609-e617f33b4e0e" },
        { amount: 96, text: "", bookedDate: "2020-08-06T19:30:00.000Z", type: "Income", category: "Salary", id: "1b806abf-9012-477f-9f1b-c99c53e1cb7d" }
    ];

    const organizedTransactions = Object.fromEntries([...new Set(order?.pitches?.map(t => parseInt(t.bookedDate.split('-')[0])))].map(yr => [yr, Object.fromEntries([...new Set(order?.pitches?.filter(t => parseInt(t.bookedDate.split('-')[0]) === yr).map(t => parseInt(t.bookedDate.split('-')[1])))].map(mo => [mo, order?.pitches?.filter(t => parseInt(t.bookedDate.split('-')[0]) === yr && parseInt(t.bookedDate.split('-')[1]) === mo)]))]));

    return (
        <div>
            <div className='w-full'>
                <ResponsiveContainer width={400} height={400}>
                    <BarChart width={150} height={40} data={data}>
                        {/* <XAxis dataKey='name' />
                        <YAxis dataKey='uv' /> */}
                        <Bar dataKey={"name"} fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Barchart