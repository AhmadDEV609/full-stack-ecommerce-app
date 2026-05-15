import { Outlet, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const apiURL = import.meta.env.VITE_BACKEND_URL;

const ProtectedPage = () => {

    const { data, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await fetch(`${apiURL}/v1/api/user/status`, {
                credentials: "include"
            });
            return res.json();
        }
    });

    if (isLoading) return <p>Loading...</p>;

    if (!data?.user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedPage;