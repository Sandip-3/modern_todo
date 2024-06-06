import { useUser } from "@/context/userContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const {user} = useUser();
  if (!user) {
    return <Navigate to={"/login"} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
