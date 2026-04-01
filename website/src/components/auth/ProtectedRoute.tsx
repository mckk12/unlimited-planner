import type { FC } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../Loader';

const ProtectedRoute: FC = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader label="Checking session..." />;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;