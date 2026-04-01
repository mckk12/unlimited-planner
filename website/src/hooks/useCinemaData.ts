import { useQuery } from "@tanstack/react-query";
import { CinemaCityApiClient } from "../services/ccApiClient";
import type { MoviePoster, AttributeGroup, CCCinema, DataInCinemaAtDateResponse } from "../utils/types";

const DEFAULT_STALE_TIME_MS = 5 * 60 * 1000;

const toErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return fallback;
};

const fetchActiveCinemas = async (): Promise<CCCinema[]> => {
    const data = await CinemaCityApiClient.getActiveCinemasPoland();
    const rawCinemas = data?.body?.cinemas || [];
    return rawCinemas.map(c => ({
        id: c.id,
        groupId: c.groupId,
        displayName: c.displayName,
        link: c.link,
    }));
};

const fetchNowPlayedMovies = async (): Promise<MoviePoster[]> => {
    const data = await CinemaCityApiClient.getNowPlayedMovies();
    const raw = data?.body?.posters || [];
    return raw.map(m => ({
        code: m.code,
        attributes: m.attributes || [],
        featureTitle: m.featureTitle,
        posterSrc: m.posterSrc,
        url: m.url,
    }));
};

const fetchAttributesDescriptions = async (): Promise<AttributeGroup[]> => {
    const data = await CinemaCityApiClient.getAttributesDescriptions();
    return data?.body?.attributes || [];
};

const fetchCinemaDataPerDate = async (cinemaId: string, date: string): Promise<DataInCinemaAtDateResponse> => {
    const fetchedData = await CinemaCityApiClient.getDataInCinemaAtDate(cinemaId, date);
    return fetchedData as DataInCinemaAtDateResponse;
};

export const useActiveCinemas = () => {
    const query = useQuery({
        queryKey: ["cinemas"],
        queryFn: fetchActiveCinemas,
        staleTime: DEFAULT_STALE_TIME_MS,
    });

    return {
        cinemas: query.data || [],
        loading: query.isLoading,
        error: query.error ? toErrorMessage(query.error, "Failed to fetch cinemas.") : null,
    };
};

export const useNowPlayedMovies = () => {
    const query = useQuery({
        queryKey: ["movies-now-playing"],
        queryFn: fetchNowPlayedMovies,
        staleTime: DEFAULT_STALE_TIME_MS,
    });

    return {
        movies: query.data || [],
        loading: query.isLoading,
        error: query.error ? toErrorMessage(query.error, "Failed to fetch movies.") : null,
    };
};

export const useAttributesDescriptions = () => {
    const query = useQuery({
        queryKey: ["movies-attributes"],
        queryFn: fetchAttributesDescriptions,
        staleTime: DEFAULT_STALE_TIME_MS,
    });

    return {
        attributes: query.data || [],
        loading: query.isLoading,
        error: query.error ? toErrorMessage(query.error, "Failed to fetch attributes.") : null,
    };
};


export const useCinemaDataPerDate = (cinemaId: string, date: string) => {
    const query = useQuery({
        queryKey: ["cinema-data", cinemaId, date],
        queryFn: () => fetchCinemaDataPerDate(cinemaId, date),
        enabled: Boolean(cinemaId && date),
        staleTime: DEFAULT_STALE_TIME_MS,
    });

    return {
        data: query.data || null,
        loading: query.isLoading,
        error: query.error ? toErrorMessage(query.error, "Failed to fetch cinema data.") : null,
    };
};
