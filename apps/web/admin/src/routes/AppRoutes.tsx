import { Route, Routes } from "react-router-dom";
import DashboardPage from "../app/DashboardPage";

function AppRoutes(){
    return (
        <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
    );
};

export default AppRoutes;