import { Route, Routes, Navigate } from "react-router-dom";
import DashboardPage from "../app/DashboardPage";

function AppRoutes(){
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
    );
};

export default AppRoutes;