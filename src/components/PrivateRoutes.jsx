import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hooks/UseAuth";

const PrivateRoutes = () => {
  const { user, loading } = useAuthStatus();
  if (loading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoutes;
