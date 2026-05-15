import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
const apiURL = import.meta.env.VITE_BACKEND_URL;

const Reset = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${apiURL}/v1/api/user/reset`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Password is updated");
                setEmail("");
                setPassword("");

                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(data.message);
            }

        } catch (err) {
            setMessage("Server Error");
        }
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f5f5f5"
        }}>
            <ToastContainer />

            <form
                onSubmit={handleSubmit}
                style={{
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    width: "300px"
                }}
            >

                <h2 style={{ textAlign: "center" }}>
                    Change Password
                </h2>

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        outline: "none"
                    }}
                />

                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        outline: "none"
                    }}
                />

                <button
                    style={{
                        padding: "10px",
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Change Password
                </button>

                <p style={{
                    textAlign: "center",
                    color:
                        message.includes("not") ||
                            message.includes("Error") ||
                            message.includes("error")
                            ? "red"
                            : "green"
                }}>
                    {message}
                </p>

            </form>

        </div>
    );
};

export default Reset;