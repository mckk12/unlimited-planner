import type { FC } from "react";
import type { MoviePoster, Planner } from "../../utils/types";
import MovieCard from "./MovieCard";

interface MoviesGridProps {
    movies: MoviePoster[];
    isLoggedIn: boolean;
    planners: Planner[];
    loadingPlanners: boolean;
    onAddMovieToPlanner: (plannerId: string, movie: MoviePoster) => Promise<void>;
}

const MoviesGrid: FC<MoviesGridProps> = ({ movies, isLoggedIn, planners, loadingPlanners, onAddMovieToPlanner }) => {
    if (movies.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                No movies found matching the selected filters.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {movies.map(movie => (
                <MovieCard 
                    key={movie.code} 
                    movie={movie}
                    isLoggedIn={isLoggedIn}
                    planners={planners}
                    loadingPlanners={loadingPlanners}
                    onAddMovieToPlanner={onAddMovieToPlanner}
                />
            ))}
        </div>
    );
};

export default MoviesGrid;
