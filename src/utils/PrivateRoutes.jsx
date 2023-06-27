import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutes = () => {
    const { authenticated } = useSelector((state) => state.users);
    return (
        <>
            {authenticated ? <Outlet /> : <Navigate to='/login' />}
        </>
    );
}

export default PrivateRoutes;
