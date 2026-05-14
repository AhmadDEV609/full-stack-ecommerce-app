import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmailVerificationPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("Verifying...");
    const apiURL = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await fetch(`${apiURL}/v1/api/user/verify/${token}`);
                const data = await response.json();

                if (response.ok) {
                    setStatus(data.message || "Verification successful");
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }
            } catch (err) {
                console.log(err)
            }
        };

        if (token) verifyUser();
    }, [token, navigate]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#f4f6f8",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <div
                style={{
                    padding: "40px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    backgroundColor: "#fff",
                    textAlign: "center",
                    maxWidth: "400px",
                    width: "90%",
                }}
            >
                <h2 style={{ color: "#333", marginBottom: "20px" }}>Email Verification</h2>
                <p style={{ color: "#28a745", fontWeight: "bold" }}>{status}</p>
            </div>
        </div>
    );
};

export default EmailVerificationPage;