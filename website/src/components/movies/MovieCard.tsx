import { memo, useRef, useState, type MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import type { MoviePoster, Planner } from "../../utils/types";
import { useClickOutside } from "../../hooks/useClickOutside";

interface MovieCardProps {
    movie: MoviePoster;
    isLoggedIn: boolean;
    planners: Planner[];
    loadingPlanners: boolean;
    onAddMovieToPlanner: (plannerId: string, movie: MoviePoster) => Promise<void>;
}

const MovieCard = memo(function MovieCard({ movie, isLoggedIn, planners, loadingPlanners, onAddMovieToPlanner }: MovieCardProps) {
    const imgSrc = movie.posterSrc;
    const [popupOpen, setPopupOpen] = useState(false);
    const [isAddingMovie, setIsAddingMovie] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);

    useClickOutside(popupRef, () => setPopupOpen(false), popupOpen);

    const onAddMovie = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setPopupOpen(prev => !prev);
    };

    const handlePlannerChoice = async (e: MouseEvent<HTMLButtonElement>, plannerId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAddingMovie) {
            return;
        }

        try {
            setIsAddingMovie(true);
            await onAddMovieToPlanner(plannerId, movie);
            setPopupOpen(false);
        } finally {
            setIsAddingMovie(false);
        }
    };

    return (
        <div
            ref={popupRef}
            className="relative h-full overflow-visible"
            style={{ viewTransitionName: `movie-card-${movie.code.replace(/[^a-zA-Z0-9]/g, '')}` }}
        >
            <a
                href={movie.url}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
                <div className="relative aspect-2/3 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                        src={imgSrc}
                        alt={movie.featureTitle}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                </div>
                <div className="flex flex-1 items-center p-3 pr-12 text-left">
                    <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:font-bold dark:text-gray-100">
                        {movie.featureTitle}
                    </h3>
                </div>
            </a>

            {isLoggedIn && (
                <>
                    <button
                        onClick={onAddMovie}
                        className="absolute bottom-3 right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow dark:bg-blue-500 dark:hover:bg-blue-600"
                        title="Add as proposition to a planner"
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-sm cursor-pointer" />
                    </button>

                    {popupOpen && (
                        <div className="absolute bottom-12 right-0 z-30 mb-2 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                Add to planner
                            </p>

                            {loadingPlanners ? (
                                <p className="px-2 py-1 text-sm text-gray-500 dark:text-gray-400">Loading planners...</p>
                            ) : planners.length > 0 ? (
                                <div className="max-h-48 space-y-1 overflow-y-auto">
                                    {planners.map(planner => (
                                        <button
                                            key={planner.id}
                                            type="button"
                                            onClick={(event) => handlePlannerChoice(event, planner.id)}
                                            disabled={isAddingMovie}
                                            className="block w-full rounded-md px-2 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70 dark:text-gray-200 dark:hover:bg-gray-800"
                                        >
                                            {planner.name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                                    No planners available.
                                </p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
});

export default MovieCard;
