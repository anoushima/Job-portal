import { Navigate } from "react-router-dom";


interface ProtectedRouteProps{
    children:React.ReactNode;
    allowedRole:string;
}

const ProtectedRoute=({children,allowedRole}:ProtectedRouteProps)=>{
    const token=localStorage.getItem("access");
    const role=localStorage.getItem("role");

    if(!token || role !==allowedRole){
        return<Navigate to="/" replace/>
    }

    return<>{children}</>
};

export default ProtectedRoute