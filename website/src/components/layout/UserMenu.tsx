import { type FC } from "react";
import { Link, useLocation } from "react-router-dom";
import type { User } from "@supabase/auth-js";

interface UserMenuProps {
    user: User | null;
    logout: () => Promise<void>;
    isMobile?: boolean;
    onMenuClose?: () => void;
}

const UserMenu: FC<UserMenuProps> = ({ user, logout, isMobile = false, onMenuClose }) => {
    const location = useLocation();
    
    const handleLogout = async () => {
        await logout();
        onMenuClose?.();
    };

    if (isMobile) {
        return (
            <div className="mt-2 pt-2 border-t border-slate-800 flex flex-col gap-2">
                {user ? (
                    <>
                        <Link
                            className="text-sm font-medium px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700/70 hover:bg-slate-700/70 active:bg-slate-600/70 transition-colors text-slate-200! no-underline! text-center"
                            to="/account"
                            onClick={onMenuClose}
                        >
                            {user.user_metadata?.username}
                        </Link>
                        <button
                            className="px-4 py-3 rounded-lg! bg-cyan-400 text-slate-900 hover:bg-cyan-300 active:bg-cyan-500 transition-colors font-medium"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        className="px-4 py-3 rounded-lg bg-cyan-400 text-slate-900 hover:bg-cyan-300 active:bg-cyan-500 transition-colors no-underline! text-center font-medium"
                        to="/login"
                        state={{ from: location }}
                        onClick={onMenuClose}
                    >
                        Login
                    </Link>
                )}
            </div>
        );
    }

    // Desktop version
    return (
        <div className="hidden md:flex items-center gap-4 text-sm">
            {user ? (
                <>
                    <Link
                        className="text-slate-200! hover:text-cyan-300! transition-colors! no-underline!"
                        to="/account"
                    >
                        {user.user_metadata?.username}
                    </Link>
                    <button
                        className="cursor-pointer px-4 py-2 rounded-lg! bg-cyan-400 text-slate-900 hover:bg-cyan-300 transition-colors"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </>
            ) : (
                <Link
                    className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-900 hover:bg-cyan-300 transition-colors no-underline!"
                    to="/login"
                    state={{ from: location }}
                >
                    Login
                </Link>
            )}
        </div>
    );
};

export default UserMenu;
