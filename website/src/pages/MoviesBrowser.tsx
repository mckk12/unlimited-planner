import { type FC, useState, useMemo, useCallback } from "react";
import { useNowPlayedMovies, useAttributesDescriptions } from "../hooks/useCinemaData";
import { useUserPlanners } from "../hooks/useUserPlanners";
import { useAuth } from "../hooks/useAuth";
import { useSnackbar } from "../hooks/useSnackbar";
import MoviesFilterSidebar from "../components/movies/MoviesFilterSidebar";
import MoviesGrid from "../components/movies/MoviesGrid";
import { plannersService } from "../services/supabaseClient";
import type { MoviePoster } from "../utils/types";

const MoviesBrowser: FC = () => {
    const { user } = useAuth();
    const { showSnackbar } = useSnackbar();
    const { movies, loading: moviesLoading, error: moviesError } = useNowPlayedMovies();
    const { attributes: attributeGroups, loading: attributesLoading, error: attributesError } = useAttributesDescriptions();
    const { planners, loading: plannersLoading } = useUserPlanners(user?.id);

    const [selectedAttributes, setSelectedAttributes] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState<string>("");

    const loading = moviesLoading || attributesLoading;
    const error = moviesError || attributesError;

    const allMoviesAttributes = useMemo(() => {
        const attrs = new Set<string>();
        movies.forEach(movie => {
            movie.attributes.forEach(attr => attrs.add(attr));
        });
        return attrs;
    }, [movies]);

    const activeAttributeGroups = useMemo(() => {
        return attributeGroups
            .map(group => ({
                ...group,
                items: group.items.filter(item => allMoviesAttributes.has(item.id))
            }))
            .filter(group => group.items.length > 0);
    }, [attributeGroups, allMoviesAttributes]);

    const filteredMovies = useMemo(() => {
        let result = movies;

        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
            result = result.filter(movie => 
                movie.featureTitle.toLowerCase().includes(query)
            );
        }

        if (selectedAttributes.size > 0) {
            result = result.filter(movie => 
                Array.from(selectedAttributes).every(attr => movie.attributes.includes(attr))
            );
        }

        return result;
    }, [movies, selectedAttributes, searchQuery]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    const toggleAttribute = useCallback((attr: string) => {
        setSelectedAttributes(prev => {
            const next = new Set(prev);
            if (next.has(attr)) {
                next.delete(attr);
            } else {
                next.add(attr);
            }
            return next;
        });
    }, []);

    const handleAddMovieToPlanner = useCallback(async (plannerId: string, movie: MoviePoster) => {
        try {
            await plannersService.addMovieToPlanner(plannerId, movie.code);
            showSnackbar(`Added "${movie.featureTitle}" to planner`, 'success');
        } catch {
            showSnackbar('Could not add movie to planner', 'error');
        }
    }, [showSnackbar]);

    if (loading) {
        return <div className="p-4 text-center mt-10">Loading movies...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500 mt-10">{error}</div>;
    }

    return (
        <div className="p-4 flex flex-col md:flex-row gap-6 w-full h-full flex-1 min-h-0">
            <MoviesFilterSidebar 
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                activeAttributeGroups={activeAttributeGroups}
                selectedAttributes={selectedAttributes}
                onToggleAttribute={toggleAttribute}
            />

            <main className="flex-1 min-w-0 h-full">
                <MoviesGrid
                    movies={filteredMovies}
                    isLoggedIn={!!user}
                    planners={planners}
                    loadingPlanners={plannersLoading}
                    onAddMovieToPlanner={handleAddMovieToPlanner}
                />
            </main>
        </div>
    );
}

export default MoviesBrowser;