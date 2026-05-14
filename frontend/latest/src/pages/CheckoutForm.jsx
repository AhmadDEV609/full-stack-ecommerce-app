import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "../css/payment.css";

const apiURL = import.meta.env.VITE_BACKEND_URL;
const CheckoutForm = ({ clientSecret, orderId }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handlePay = async () => {
        if (!stripe || !elements) return;

        const { paymentIntent, error } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            }
        );

        if (error) {
            alert(error.message);
            return;
        }

        if (paymentIntent?.status === "succeeded") {

            const res = await fetch(`${apiURL}/v1/api/order/mark-paid`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    orderId,
                    paymentIntentId: paymentIntent.id,
                }),
            });

            const data = await res.json();

            if (data?.order?._id) {
                alert("Payment Successful 🎉 Order Updated");
            } else {
                alert("Payment done but order not updated");
            }
        }
    };

    return (
        <div className="stripeCheckoutBox">
            <div className="stripeCardWrapper">
                <CardElement />
            </div>

            <button className="stripePayButton" onClick={handlePay}>
                Pay Now
            </button>
        </div>
    );
};

export default CheckoutForm;