import { Route, Routes } from "react-router-dom";
import LandingPage from "../app/LandingPage";
import RegisterPage from "../app/RegisterPage";
import LoginPage from "../app/LoginPage";

function AppRoutes(){
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
    );
};

export default AppRoutes;