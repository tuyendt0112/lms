import { Piechart, NewDashBoard, Barchart, Chart } from "components";
import React, { useEffect, useState } from "react";
import { apiGetOrderByAdmin } from "apis";
import { formatMoney } from "ultils/helper";

const Dashboard = () => {
    const [order, setOrder] = useState(null);
    const [counts, setCounts] = useState(0);

    const fetchOrderData = async () => {
        const response = await apiGetOrderByAdmin();
        if (response.success) {
            setOrder(response.allOrder);
            //   setCounts(response.allOrder.length());
            //   console.log(response.allOrder);
            //   console.log(
            //     response.allOrder?.reduce((sum, el) => sum + Number(el.total), 0)
            //   );
        }
    };
    useEffect(() => {
        fetchOrderData();
    }, []);
    return (
        <div >
            <NewDashBoard></NewDashBoard>
            <div className="w-full flex flex-col items-center ">
                <div>
                    <Piechart></Piechart>
                    {/* <Chart /> */}
                    <Barchart />
                </div>
                <div>
                    <span>Total Profit: </span>
                    <span className="text-main text-3xl font-semibold">
                        {formatMoney(order?.reduce((sum, el) => sum + Number(el.total), 0)) +
                            'VND'}
                    </span>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;