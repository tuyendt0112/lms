import React from "react"
import { Piechart, NewDashBoard, Barchart, Chart } from 'components'

const Dashboard = () => {

    return (
        <div className='flex-gap4'>
            <NewDashBoard></NewDashBoard>
            <div className="flex flex-col items-center w-full">
                <Piechart></Piechart>
                {/* <Chart /> */}
                <Barchart />
            </div>
        </div>
    )
}


export default Dashboard