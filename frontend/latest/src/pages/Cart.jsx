import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "../css/cart.css";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";

const Cart = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const res = await fetch("http://localhost:5000/v1/api/cart/display", {
                credentials: "include",
            });
            return res.json();
        },
    });

    const items = data?.cart?.items || [];

    const updateQty = useMutation({
        mutationFn: async ({ id, type }) => {
            const url =
                type === "increase"
                    ? `http://localhost:5000/v1/api/cart/quantityIncrease/${id}`
                    : `http://localhost:5000/v1/api/cart/quantityDecrease/${id}`;

            await fetch(url, {
                method: "PUT",
                credentials: "include",
            });

            return { id, type };
        },

        onMutate: async (variables) => {
            const { id, type } = variables;

            await queryClient.cancelQueries(["cart"]);

            const previousCart = queryClient.getQueryData(["cart"]);

            queryClient.setQueryData(["cart"], (old) => {
                if (!old) return old;

                return {
                    ...old,
                    cart: {
                        ...old.cart,
                        items: old.cart.items.map((item) => {
                            if (item.product._id !== id) return item;

                            return {
                                ...item,
                                quantity:
                                    type === "increase"
                                        ? item.quantity + 1
                                        : Math.max(item.quantity - 1, 1),
                            };
                        }),
                    },
                };
            });

            return { previousCart };
        },

        onError: (err, variables, context) => {
            queryClient.setQueryData(["cart"], context.previousCart);
            toast.error("Update failed");
        },

        onSettled: () => {
            queryClient.invalidateQueries(["cart"]);
        },
    });

    const removeItem = useMutation({
        mutationFn: async (id) => {
            await fetch(`http://localhost:5000/v1/api/cart/delete/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            return id;
        },


        onMutate: async (id) => {
            await queryClient.cancelQueries(['cart'])
            const previousCart = queryClient.getQueryData(["cart"]);

            queryClient.setQueryData(["cart"], (old) => {
                if (!old) return old;

                return {
                    ...old,
                    cart: {
                        ...old.cart,
                        items: old.cart.items.filter(
                            (item) => item.product._id !== id
                        ),
                    },
                };
            });
        },

        onError: (err, id, context) => {
            queryClient.setQueryData(["cart"], context.previousCart);
            toast.error("Update failed");
        },

        onSettled: () => {
            queryClient.invalidateQueries(["cart"]);
        },

    });

    const totalPrice = items.reduce(
        (sum, i) => sum + (i.product?.price || 0) * i.quantity,
        0
    );

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading cart</p>;

    return (
        <div className="cart-prof-page">
            <ToastContainer />

            <div className="cart-prof-container">

                <div className="cart-prof-items">

                    {items.length === 0 ? (
                        <p className="cart-prof-empty">Cart Empty</p>
                    ) : (
                        items.map((item) => (
                            <div className="cart-prof-card" key={item.product._id}>

                                <img
                                    className="cart-prof-img"
                                    src={`http://localhost:5000/public/images/${item.product.thumbnail}`}
                                    alt={item.product.name}
                                />

                                <div className="cart-prof-info">
                                    <h4>{item.product.name}</h4>

                                    <p>$ {item.product.price}</p>

                                    <p>Qty: {item.quantity}</p>

                                    <p>Size: {item.size || "N/A"}</p>

                                    <div className="cart-prof-buttons">

                                        <button
                                            className="cart-prof-btn cart-prof-increase"
                                            onClick={() =>
                                                updateQty.mutate({
                                                    id: item.product._id,
                                                    type: "increase",
                                                })
                                            }
                                        >
                                            +
                                        </button>

                                        <button
                                            className="cart-prof-btn cart-prof-decrease"
                                            onClick={() =>
                                                updateQty.mutate({
                                                    id: item.product._id,
                                                    type: "decrease",
                                                })
                                            }
                                        >
                                            -
                                        </button>

                                        <button
                                            className="cart-prof-btn"
                                            onClick={() =>
                                                removeItem.mutate(item.product._id)
                                            }
                                        >
                                            <MdDelete />
                                        </button>

                                    </div>
                                </div>

                                <div className="cart-prof-total">
                                    $ {item.product.price * item.quantity}
                                </div>

                            </div>
                        ))
                    )}

                </div>

                <div className="cart-prof-summary">
                    <h3 className="cart-prof-summary-title">Order Summary</h3>

                    <p className="cart-prof-summary-total">
                        Total: $ {totalPrice}
                    </p>

                    <button
                        className="cart-prof-checkout-btn"
                        onClick={() => navigate("/order")}
                        disabled={items.length === 0}
                    >
                        Checkout
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Cart;