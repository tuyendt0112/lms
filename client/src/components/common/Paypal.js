import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer,
  } from "@paypal/react-paypal-js";
  import { useEffect } from "react";
  import { FaAws } from "react-icons/fa";
  import { apiStatusOrder } from "apis";
  // This value is from the props in the UI
  import Swal from "sweetalert2";
  const style = { layout: "vertical" };
  
  // Custom component to wrap the PayPalButtons and show loading spinner
  const ButtonWrapper = ({
    currency,
    showSpinner,
    amount,
    payload,
    setIsSuccess,
  }) => {
    const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
    useEffect(() => {
      dispatch({
        type: "resetOptions",
        value: {
          ...options,
          currency: currency,
        },
      });
    }, [currency, showSpinner]);
    const handleOrder = async () => {
      // console.log(payload);
      const { order } = payload;
      console.log(order);
      const status = "Success";
      let successCount = 0;
      for (const _id of order) {
        const response = await apiStatusOrder(_id);
        console.log(response);
        if (response.success) {
          successCount++;
        }
      }
      if (successCount === order.length) {
        // Nếu tất cả responses thành công, đóng cửa sổ
        setIsSuccess(true);
        setTimeout(() => {
          Swal.fire("Congratulate", "Payment Success", "Success").then(() => {
            window.close();
          });
        }, 500);
      }
    };
    return (
      <>
        {showSpinner && isPending && <div className="spinner" />}
        <PayPalButtons
          style={style}
          disabled={false}
          forceReRender={[style, currency, amount]}
          fundingSource={undefined}
          createOrder={(data, actions) => {
            return actions.order
              .create({
                purchase_units: [
                  { amount: { currency_code: currency, value: amount } },
                ],
              })
              .then((orderID) => orderID);
          }}
          onApprove={(data, actions) => {
            actions.order.capture().then(async (response) => {
              if (response.status === "COMPLETED") {
                console.log(response);
                handleOrder();
              }
              // console.log(response);
            });
          }}
        />
      </>
    );
  };
  
  export default function Paypal({ amount, payload, setIsSuccess }) {
    return (
      <div style={{ maxWidth: "750px", minHeight: "200px", margin: "auto" }}>
        <PayPalScriptProvider
          options={{ clientId: "test", components: "buttons", currency: "USD" }}
        >
          <ButtonWrapper
            payload={payload}
            currency={"USD"}
            amount={amount}
            showSpinner={false}
            setIsSuccess={setIsSuccess}
          />
        </PayPalScriptProvider>
      </div>
    );
  }
  