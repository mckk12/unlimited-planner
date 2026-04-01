import { useState, useEffect, type ReactNode} from "react";
import type { AuthActionResult, RegisterDataType } from "../utils/types";
import { supabase } from "../services/supabaseClient";
import { AuthContext } from "./AuthContextValue";
import type { User } from "@supabase/auth-js";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    // const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const logoutFn = async () => {
        await supabase.auth.signOut();
    }

    const register = async (registerData : RegisterDataType): Promise<AuthActionResult> => {
        try {
            const { data, error } = await supabase.auth.signUp(
                {
                    email: registerData.email,
                    password: registerData.password,
                    options: {
                        data: {
                            username: registerData.username,
                            ccnumber: registerData.ccnumber,
                        }
                    }
                }
            );
            if (error) {
                return { success: false, error };
            }
            if (!data.session) {
                return { success: false, error: "No session returned" };
            }
            setUser(data.user);
            // setSession(data.session);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unexpected error",
            };
        } finally {
            setLoading(false);
        }
    };

    const login = async (email:string, password:string): Promise<AuthActionResult> => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) {
                return { success: false, error };
            }
            if (!data.session) {
                return { success: false, error: "No session returned" };
            }
            setUser(data.user);
            // setSession(data.session);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unexpected error",
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await logoutFn();
        } finally {
            setUser(null);
        }
    };

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange(
            (_, session) => {
                if (session?.user) {
                    setUser(session.user);
                } else {                    
                    setUser(null);
                }
                setLoading(false);
            }
        );

        return () => data.subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, register, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
