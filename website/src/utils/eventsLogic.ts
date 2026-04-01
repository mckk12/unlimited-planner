import type {  UserAvailability, DataInCinemaAtDateResponse, SupabaseMovie } from "./types"
import { toDateKey } from "./dateUtils";

const MIN_PEOPLE = 1; // minimum number of people for event to be shown

interface AvailabilityOnDay{
    username: string;
    userId: string;
    canGo: number[];
    maybe: number[];
}

interface AvailabilityDict {
    [date: string]: AvailabilityOnDay[];
}

interface BanDict {
    [movieId: string]: Set<string>; // set of user_ids who banned the movie
}

interface EventFullData {
    eventId: number; //events.id
    movieId: string; //events.filmId
    title: string; //films.name
    bookingLink: string; //events.bookingLink
    dateTime: Date; //event.eventDateTime
    screenTime: number; //films.length
    availabilityRatio: number; //events.availabilityRatio
    attributeIds: string[]; //films.attributeIds
}

interface EventWithAvailability extends EventFullData {
    people: { 
        maybe: string[];
        canGo: string[];
    };
}

const changeAvailToDict = (avail: UserAvailability[]) => {
    const result: AvailabilityDict = {};
    avail.forEach(userAvail => {
        const makeDate = new Date(userAvail.date);
        const dateOnly = toDateKey(new Date(makeDate.getFullYear(), makeDate.getMonth(), makeDate.getDate()));
        if (!result[dateOnly]) {
            result[dateOnly] = [];
        }
        result[dateOnly].push({
            userId: userAvail.user.id,
            username: userAvail.user.username,
            canGo: userAvail.availability.canGo,
            maybe: userAvail.availability.maybe
        });
    });
    return result;
};

const createBanDict = (movies: SupabaseMovie[]) => {
    const dict: BanDict = {};
    movies.forEach(movie => {
        dict[movie.external_movie_id] = new Set(movie.bans);
    });
    return dict;
};

const addAvailabilityToEvent = (event: EventFullData, availabilityOnDay: AvailabilityOnDay[], bans: Set<string>): EventWithAvailability => {
    const eventDate = new Date(event.dateTime);
    const startHour = eventDate.getHours();
    const endHour = startHour + Math.floor((eventDate.getMinutes() + event.screenTime) / 60);
    const hoursToCover = [...Array(endHour - startHour).keys()].map(h => h + startHour);

    // const canGoUsers = availabilityOnDay.filter(avail => hoursToCover.every(h => avail.canGo.includes(h))).map(avail => avail.username);
    // const maybeUsers = availabilityOnDay.filter(avail => hoursToCover.every(h => avail.maybe.concat(avail.canGo).includes(h))).map(avail => avail.username).filter(username => !canGoUsers.includes(username));

    const canGoUsers = availabilityOnDay.filter(avail => hoursToCover.every(h => avail.canGo.includes(h)) && !bans.has(avail.userId)).map(avail => avail.username);
    const maybeUsers = availabilityOnDay.filter(avail => hoursToCover.every(h => avail.maybe.concat(avail.canGo).includes(h)) && !bans.has(avail.userId)).map(avail => avail.username).filter(username => !canGoUsers.includes(username));

    return {
        ...event,
        people: {
            canGo: canGoUsers,
            maybe: maybeUsers
        }
    };
};


const calculateEventsToShow = (
    cinemaDataPerDates: DataInCinemaAtDateResponse[], 
    usersAvailability: UserAvailability[], 
    moviesInPlanner: SupabaseMovie[],
    plannerStartHour: number, plannerEndHour: number) => {
        
    const moviesIdsInPlannerSet = new Set(moviesInPlanner.map(m => m.external_movie_id));
    const plannerMoviesData = cinemaDataPerDates
        .flatMap(data => data.body.films)
        .filter(film => moviesIdsInPlannerSet.has(film.id));
    const plannerMoviesById = new Map(plannerMoviesData.map(film => [film.id, film]));
    const allEvents = cinemaDataPerDates.flatMap(data => data.body.events);

    const possibleEvents = allEvents.filter(event => {
        const eventHour = new Date(event.eventDateTime).getHours();
        if (eventHour < plannerStartHour || eventHour >= plannerEndHour) {
            return false;
        }
        if (!moviesIdsInPlannerSet.has(event.filmId)) {
            return false;
        }

        return true;
    });

    const eventsWithFullData: EventFullData[] = possibleEvents.map(event => {
        const filmData = plannerMoviesById.get(event.filmId);
        return {
            eventId: event.id,
            movieId: event.filmId,
            title: filmData ? filmData.name : "Unknown Film",
            bookingLink: event.bookingLink,
            dateTime: event.eventDateTime,
            screenTime: filmData ? filmData.length : 120, // default to 2h if not found
            availabilityRatio: event.availabilityRatio,
            attributeIds: event.attributeIds
        };
    });

    const availabilityDict = changeAvailToDict(usersAvailability);
    const banDict = createBanDict(moviesInPlanner);

    const eventsWithAvailability: EventWithAvailability[] = eventsWithFullData.map(event => {
        const eventToDate = new Date(event.dateTime);
        const eventDateOnly = toDateKey(new Date(eventToDate.getFullYear(), eventToDate.getMonth(), eventToDate.getDate()));
        const availabilityOnDay = availabilityDict[eventDateOnly] || [];
        return addAvailabilityToEvent(event, availabilityOnDay, banDict[event.movieId] || new Set());
    });

    return eventsWithAvailability.filter(event => event.people.canGo.length + event.people.maybe.length > MIN_PEOPLE);
};

export {
    calculateEventsToShow
};