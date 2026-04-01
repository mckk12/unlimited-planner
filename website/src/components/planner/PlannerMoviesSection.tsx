import { memo, useMemo, useRef, useState, type ChangeEvent, type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faBan, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { type MoviePoster, type SupabaseMovie } from "../../utils/types";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useAuth } from "../../hooks/useAuth";

type PlannerMoviesSectionProps = {
    movies: MoviePoster[];
    plannerMovies: SupabaseMovie[];
    onToggleBanMovie: (movieCode: string) => void;
    onAddMovie: (movieCode: string) => void;
    onRemoveMovie: (movieCode: string) => void;
};

const PlannerMoviesSection: FC<PlannerMoviesSectionProps> = ({
    movies,
    plannerMovies,
    onToggleBanMovie,
    onAddMovie,
    onRemoveMovie,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isMovieDropdownOpen, setIsMovieDropdownOpen] = useState(false);
    const dropdownContainerRef = useRef<HTMLDivElement | null>(null);
    const {user } = useAuth();

    useClickOutside(dropdownContainerRef, () => setIsMovieDropdownOpen(false), isMovieDropdownOpen);

    const plannedMovieCodes = useMemo(() => plannerMovies.map(m => m.external_movie_id), [plannerMovies]);

    const plannedMovieSet = useMemo(() => new Set(plannedMovieCodes), [plannedMovieCodes]);

    const availableMovies = useMemo(
        () => movies.filter(movie => !plannedMovieSet.has(movie.code)),
        [movies, plannedMovieSet],
    );

    const filteredMovies = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            return availableMovies;
        }
        return availableMovies.filter(movie => movie.featureTitle.toLowerCase().includes(query));
    }, [availableMovies, searchQuery]);

    const plannedMovies = useMemo(
        () => plannedMovieCodes.map(code => movies.find(movie => movie.code === code) ?? null),
        [plannedMovieCodes, movies],
    );

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setIsMovieDropdownOpen(true);
    };

    return (
        <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-100">Add Movies</h2>
            <div ref={dropdownContainerRef} className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsMovieDropdownOpen(true)}
                    onChange={handleSearchChange}
                    placeholder="Search movie title..."
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
                />

                {isMovieDropdownOpen && (
                    <div className="absolute z-20 mt-2 max-h-72 w-full space-y-2 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-xl">
                        {filteredMovies.length > 0 ? (
                            filteredMovies.map(movie => (
                                <div key={movie.code} className="flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-2">
                                    <span className="text-sm text-slate-200">{movie.featureTitle}</span>
                                    <button
                                        type="button"
                                        onClick={() => onAddMovie(movie.code)}
                                        className="rounded-md bg-cyan-600 px-2 py-1 text-xs font-semibold text-white transition-colors hover:bg-cyan-500"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-400">
                                No movies found for this search.
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-4 space-y-2">
                {plannedMovieCodes.map((movieCode, index) => (
                    <div key={movieCode} className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2">
                        <span className="text-sm text-slate-200">{plannedMovies[index]?.featureTitle ?? "Unknown Movie"}</span>
                        {(() => {
                            const movie = plannerMovies.find(m => m.external_movie_id === movieCode);
                            const isBannedByCurrentUser = !!(movie && user && movie.bans?.includes(user.id));
                            return (
                                <button
                                    type="button"
                                    onClick={() => onToggleBanMovie(movieCode)}
                                    className={`cursor-pointer ml-auto rounded-md p-1 text-white transition-colors flex items-center justify-center ${isBannedByCurrentUser ? "bg-red-600 hover:bg-red-500" : "bg-yellow-600 hover:bg-yellow-500"}`}
                                    title={isBannedByCurrentUser ? "Unban movie" : "Ban movie"}
                                >
                                    <FontAwesomeIcon icon={isBannedByCurrentUser ? faArrowRotateLeft : faBan} className="text-sm" />
                                </button>
                            );
                        })()}
                        <button
                            type="button"
                            onClick={() => onRemoveMovie(movieCode)}
                            className="cursor-pointer rounded-md bg-red-600 p-1 text-white transition-colors flex items-center justify-center hover:bg-red-500"
                            title="Remove movie"
                        >
                            <FontAwesomeIcon icon={faTrash} className="text-sm" />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default memo(PlannerMoviesSection);