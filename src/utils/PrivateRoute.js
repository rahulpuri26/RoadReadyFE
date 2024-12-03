import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
  if (role && payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
