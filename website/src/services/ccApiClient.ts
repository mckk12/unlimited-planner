import axios from "axios";
import config from "../utils/config";
import type { MoviePoster, CCCinema, AttributeGroup } from "../utils/types";

type ApiResponse<T> = {
    body: T;
};

type CinemasResponse = {
    cinemas: CCCinema[];
};

type MoviesResponse = {
    posters: MoviePoster[];
};

type AttributesResponse = {
    attributes: AttributeGroup[];
};

// filmy w kinie z godzinami gry: https://www.cinema-city.pl/pl/data-api-service/v1/quickbook/10103/film-events/in-cinema/{cinema_id}/at-date/2026-02-11
// wroclavia=1097

// kina: https://www.cinema-city.pl/pl/data-api-service/v1/quickbook/10103/cinemas/with-event/until/2027-02-11

// grane teraz filmy: https://www.cinema-city.pl/pl/data-api-service/v1/feed/10103/byName/now-playing
// lub do danego dnia: https://www.cinema-city.pl/pl/data-api-service/v1/quickbook/10103/films/until/2027-02-11

// godziny gry danego filmu w danym dniu w danym kinie (dodac filter dla id kina):
// https://www.cinema-city.pl/pl/data-api-service/v1/quickbook/10103/cinema-events/in-group/{cinema_groupId}/with-film/{movie_id}/at-date/2026-02-11

//TODO
// rozplanowanie miejsc w sali (venueId to id sali, seatplanId to id rozplanowania miejsc):
// https://tickets.cinema-city.pl/api/seats/seatplanV2?venueId=384&seatplanId=1 (POST idk why)

// https://tickets.cinema-city.pl/api/seats/seats-statusV2?presentationId=1298136&venueTypeId=1&isReserved=1

const CinemaCityClient = axios.create({
    baseURL: config.CINEMACITY_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        // "X-API-Key": import.meta.env.VITE_CINEMACITY_API_KEY,
    },
});

const apiRequest = async <T>(
    request: () => Promise<{ data: unknown }>,
    errorMessage: string,
): Promise<T> => {
    try {
        const response = await request();
        const data = response.data as T;
        return data;
    } catch (error) {
        console.error(errorMessage, error);
        throw error;
    }
};

const getActiveCinemasPoland = async (): Promise<ApiResponse<CinemasResponse>> => {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    return apiRequest(
        () => CinemaCityClient.get(`/quickbook/10103/cinemas/with-event/until/${endDate}`),
        "Error fetching cinemas:"
    );
};

const getNowPlayedMovies = async (): Promise<ApiResponse<MoviesResponse>> => {
    return apiRequest(
        () => CinemaCityClient.get("/feed/10103/byName/now-playing"),
        "Error fetching now playing films:"
    );
};

const getAttributesDescriptions = async (): Promise<ApiResponse<AttributesResponse>> => {
    return apiRequest(
        () => CinemaCityClient.get("/quickbook/10103/attributes"),
        "Error fetching attributes descriptions:"
    );
};

//zwraca wszystkie filmy i eventy w kinie danego dnia
const getDataInCinemaAtDate = async (cinemaId: string, date: string) => {
    return apiRequest(
        () => CinemaCityClient.get(`/quickbook/10103/film-events/in-cinema/${cinemaId}/at-date/${date}`),
        "Error fetching films data in cinema:"
    );
};

// zwraca eventy dla filmu w grupie kin w danym dniu
// const getMovieEventsInCinemasGroupAtDate = async (cinemaGroupId: string, movieId: string, date: string) => {
//     return apiRequest(
//         () => CinemaCityClient.get(`/quickbook/10103/cinema-events/in-group/${cinemaGroupId}/with-film/${movieId}/at-date/${date}`),
//         "Error fetching film data in cinemas group at date:"
//     );
// };

//zeby w moviebrowser uzywajac przycisku dodaj sprawdzic czy film jest grany w kinie
const getMoviesInCinema = async (cinemaId: string) => {
    return apiRequest(
        () => CinemaCityClient.get(`/10103/trailers/byCinemaId/${cinemaId}`),
        "Error fetching films in cinema:"
    );
}

// const getMovieData = async (movieId: string) => {
//     return apiRequest(
//         () => CinemaCityClient.get(`/10103/films/byDistributorCode/${movieId}`),
//         "Error fetching film data:"
//     );
// }


// zeby sprawdzic informacje o sali dla danego pokazu
const getEventData = async (eventId: string) => {
    return apiRequest(
        () => CinemaCityClient.get(`https://tickets.cinema-city.pl/api/presentations/${eventId}`),
        "Error fetching event data:"
    );
}

const getSeatPlan = async (venueId: string, seatplanId: number = 1) => {
    return apiRequest(
        () => axios.post("https://tickets.cinema-city.pl/api/seats/seatplanV2", {
            venueId,
            seatplanId,
        }),
        "Error fetching seat plan:"
    );
};

export const CinemaCityApiClient = {
    getActiveCinemasPoland,
    getNowPlayedMovies,
    getDataInCinemaAtDate,
    // getMovieEventsInCinemasGroupAtDate,
    getAttributesDescriptions,
    getSeatPlan,
    getEventData,
    getMoviesInCinema
};