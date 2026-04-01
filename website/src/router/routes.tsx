import type { FC } from "react";
import {Routes, Route} from "react-router-dom";
import Home from "../pages/Home";
import PlannersLobby from "../pages/PlannersLobby";
import Planner from "../pages/Planner";
import Account from "../pages/Account";
import Availability from "../pages/Availability";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import MoviesBrowser from "../pages/MoviesBrowser";
import ScreeningRooms from "../pages/ScreeningRooms";
import { ProtectedRoute } from "../components/auth";



const AppRoutes:FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planners" element={<PlannersLobby />} />
            <Route path="/screening-rooms" element={<ScreeningRooms />} />
            <Route element={<ProtectedRoute/>} >
                <Route path="/planner/:plannerId" element={<Planner />} />
                <Route path="/account" element={<Account />} />
                <Route path="/availability" element={<Availability />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/moviesbrowser" element={<MoviesBrowser />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;