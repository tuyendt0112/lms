import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { apiGetUsers, apiGetPitches } from 'apis'
import { useParams } from 'react-router-dom'
import { renderCustomizedLabel } from 'ultils/helper'
import { useSelector } from 'react-redux'

const PiechartCategory = () => {

    const COLORS = ['#00C49F', '#FFBB28', '#FF8042', "#FF0000", "#0000FF"]

    const [category, setcategory] = useState(null)
    const [category1, setcategory1] = useState(null)
    const [category2, setcategory2] = useState(null)
    const [category3, setcategory3] = useState(null)
    const [category4, setcategory4] = useState(null)

    const fetchPitchCategory = async () => {
        const response = await apiGetPitches({ category: 'Sân 3' })
        if (response.success) setcategory(response)
    }
    const fetchPitchCategory1 = async () => {
        const response = await apiGetPitches({ category: 'Sân 5' })
        if (response.success) setcategory1(response)
    }
    const fetchPitchCategory2 = async () => {
        const response = await apiGetPitches({ category: 'Sân 7' })
        if (response.success) setcategory2(response)
    }
    const fetchPitchCategory3 = async () => {
        const response = await apiGetPitches({ category: 'Sân 11' })
        if (response.success) setcategory3(response)
    }
    const fetchPitchCategory4 = async () => {
        const response = await apiGetPitches({ category: 'Sân Futsal' })
        if (response.success) setcategory4(response)
    }
    useEffect(() => {
        fetchPitchCategory()
        fetchPitchCategory1()
        fetchPitchCategory2()
        fetchPitchCategory3()
        fetchPitchCategory4()

    }, [])
    const data = [
        { name: 'Sân 3', value: category?.totalCount },
        { name: 'Sân 5', value: category1?.totalCount },
        { name: 'Sân 7', value: category2?.totalCount },
        { name: 'Sân 11', value: category3?.totalCount },
        { name: 'Sân Futsal', value: category4?.totalCount },


    ]


    return (
        <div className="w-full h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col">
            <strong className="text-gray-700 font-bold text-center">Number of Pitches by Category</strong>
            <div className="mt-3 w-full flex-1 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={300}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="45%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={105}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default PiechartCategory