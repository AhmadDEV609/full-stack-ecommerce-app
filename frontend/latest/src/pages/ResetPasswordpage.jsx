import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const apiURL = import.meta.env.VITE_BACKEND_URL;

const ResetPasswordpage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`${apiURL}/v1/api/user/newPassword/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword: password })
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("Password updated");
            setTimeout(() => navigate("/login"), 1500);
        } else {
            setMessage(data.message);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                />

                <button>Update</button>
            </form>

            <p>{message}</p>
        </div>
    );
};

export default ResetPasswordpage;