import { useEffect, useRef, useState, type FC } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import UserMenu from "./UserMenu";

interface NavLink {
    to: string;
    label: string;
    requiresAuth?: boolean;
}

const Navbar: FC = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isMenuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
                setIsMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isMenuOpen]);

    const desktopNavBaseClass =
        "text-sm font-medium px-3 py-2 rounded-lg border transition-colors no-underline!";
    const desktopNavActiveClass = "bg-cyan-500/20 border-cyan-400/70 text-cyan-200!";
    const desktopNavInactiveClass =
        "bg-slate-800/70 border-slate-700/70 hover:bg-slate-700/70 text-slate-200!";

    const mobileNavBaseClass =
        "text-sm font-medium px-4 py-3 rounded-lg border transition-colors no-underline! text-center";
    const mobileNavActiveClass = "bg-cyan-500/20 border-cyan-400/70 text-cyan-200!";
    const mobileNavInactiveClass =
        "bg-slate-800/70 border-slate-700/70 hover:bg-slate-700/70 active:bg-slate-600/70 text-slate-200!";

    const navLinks: NavLink[] = [
        { to: "/moviesbrowser", label: "Movies" },
        { to: "/screening-rooms", label: "Rooms" },
        { to: "/planners", label: "Planners" },
        { to: "/availability", label: "Availability", requiresAuth: true },
        
    ];

    return (
        <nav 
            className="sticky top-0 left-0 right-0 z-50 w-full border-b border-slate-800 bg-slate-950"
            style={{ viewTransitionName: "site-navbar" }}
        >
            <div className="relative px-4 py-3 sm:px-6 sm:py-4" ref={mobileMenuRef}>
                {/* Desktop & Mobile Header */}
                <div className="flex items-center justify-between">
                    {/* Logo & Navigation - Left Side */}
                    <div className="flex items-center gap-3 sm:gap-6">
                        <Link 
                            className="text-slate-200! text-lg sm:text-xl font-bold hover:text-cyan-300! transition-colors! no-underline!" 
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Unlimited Planner
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center tracking-tight gap-3">
                            {navLinks.map((link) => {
                                if (link.requiresAuth && !user) return null;
                                return (
                                    <NavLink
                                        key={link.to}
                                        className={({ isActive }) =>
                                            `${desktopNavBaseClass} ${isActive ? desktopNavActiveClass : desktopNavInactiveClass}`
                                        }
                                        to={link.to}
                                    >
                                        {link.label}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>

                    {/* Desktop User Section */}
                    <UserMenu user={user} logout={logout} />

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-slate-800/70 border border-slate-700/70 hover:bg-slate-700/70 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-5 h-0.5 bg-slate-200 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                        <span className={`block w-5 h-0.5 bg-slate-200 mt-1 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-5 h-0.5 bg-slate-200 mt-1 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="absolute left-0 right-0 top-full z-50 border-b border-slate-800 bg-slate-950/95 px-4 pb-4 pt-3 shadow-2xl backdrop-blur-sm md:hidden sm:px-6">
                        <div className="flex flex-col gap-2">
                        {navLinks.map((link) => {
                            if (link.requiresAuth && !user) return null;
                            return (
                                <NavLink
                                    key={link.to}
                                    className={({ isActive }) =>
                                        `${mobileNavBaseClass} ${isActive ? mobileNavActiveClass : mobileNavInactiveClass}`
                                    }
                                    to={link.to}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </NavLink>
                            );
                        })}
                        
                        {/* Mobile User Section */}
                        <UserMenu user={user} logout={logout} isMobile onMenuClose={() => setIsMenuOpen(false)} />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;