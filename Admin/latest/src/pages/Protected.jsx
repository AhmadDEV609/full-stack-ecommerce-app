import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
const apiURL = import.meta.env.VITE_BACKEND_URL;
const Protected = () => {

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {

        const checkStatus = async () => {

            try {

                const res = await fetch(`${apiURL}/v1/api/user/status`, {
                    credentials: 'include'
                });

                const data = await res.json();

                const user = data?.user;


                if (!user) {
                    navigate('/login');
                    return;
                }


                if (user.role !== 'admin') {
                    alert('Admin access only');
                    navigate('/login');
                    return;
                }

            } catch (error) {
                console.log(error);
                navigate('/login');
            } finally {
                setLoading(false);
            }

        };

        checkStatus();

    }, [navigate]);

    if (loading) return <div>Loading...</div>;

    return <Outlet />;
};

export default Protected;