import React from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';


const Barchart = ({ brand }) => {

    return (
        <div>
            <div className='w-full'>
                <ResponsiveContainer width={400} height={400}>
                    <BarChart width={150} height={40} data={brand?.Brands}>
                        <XAxis dataKey='title' />
                        <YAxis dataKey='totalPitch' />
                        <Bar dataKey={'totalPitch'} fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Barchart