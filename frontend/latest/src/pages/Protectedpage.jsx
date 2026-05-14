import { Outlet, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const ProtectedPage = () => {
    const apiURL = import.meta.env.VITE_BACKEND_URL;
    const { data, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await fetch(`${apiURL}/v1/api/user/status`, {
                credentials: "include",
            });
            return res.json();
        },
    });

    if (isLoading) return <div>Loading...</div>;

    const user = data?.user;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'user') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedPage;