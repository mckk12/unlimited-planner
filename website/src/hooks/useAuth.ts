import { useContext } from "react";
import { AuthContext } from "../contexts";


export const useAuth = () => {
    const { user, register, login, logout, loading } = useContext(AuthContext)!;

    return { user, register, login, logout, loading };
};
