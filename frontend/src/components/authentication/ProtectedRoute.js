import { Navigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

export const ProtectedRoute = ({ children }) => {
    const [cookies] = useCookies(['auth-cookie']);
    if (!cookies["auth-cookie"]) {
        return <Navigate to="/login" />;
    }
    
    return children;
};