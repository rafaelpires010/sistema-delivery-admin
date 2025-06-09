import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Restaurants from '../pages/Restaurants';
import NewRestaurant from '../pages/NewRestaurant';
import RestaurantDetails from '../pages/RestaurantDetails';
import NotFound from '../pages/NotFound';

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div />; // ou um spinner de carregamento
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/restaurants/new" element={<NewRestaurant />} />
                <Route path="/restaurants/:id" element={<RestaurantDetails />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}; 