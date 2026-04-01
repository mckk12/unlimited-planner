import { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { availabilityService } from "../services/supabaseClient";
import { CinemaCityApiClient } from "../services/ccApiClient";
import { calculateEventsToShow } from "../utils/eventsLogic";
import type { DataInCinemaAtDateResponse, PlannerDetails, UserAvailability } from "../utils/types";
import type { EventProps } from "../components/planner/CalendarComponents/types";
import { toDateKey } from "../utils/dateUtils";

type UsePlannerCalendarDataParams = {
    plannerDetails: PlannerDetails | null;
    calendarDate: Date;
};

export const usePlannerCalendarData = ({ plannerDetails, calendarDate }: UsePlannerCalendarDataParams) => {
    const [usersAvailabilities, setUsersAvailabilities] = useState<UserAvailability[]>([]);
    const [loadingUsersAvailability, setLoadingUsersAvailability] = useState(false);

    const weekDates = useMemo(
        () => Array.from({ length: 7 }, (_, index) => {
            const date = new Date(calendarDate);
            date.setDate(calendarDate.getDate() + index);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }),
        [calendarDate],
    );

    const dateStrings = useMemo(() => weekDates.map(d => toDateKey(d)), [weekDates]);
    const userIds = useMemo(() => plannerDetails?.users.map(user => user.id) ?? [], [plannerDetails?.users]);

    useEffect(() => {
        if (!plannerDetails?.id || userIds.length === 0) {
            return;
        }

        let cancelled = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoadingUsersAvailability(true);

        availabilityService.getAvailabilityForUsersOnDays(userIds, dateStrings)
            .then((data) => {
                if (cancelled) {
                    return;
                }

                setUsersAvailabilities((data as unknown as UserAvailability[]) || []);
            })
            .catch((error) => {
                if (cancelled) {
                    return;
                }

                console.error("Error fetching users availability:", error);
                setUsersAvailabilities([]);
            })
            .finally(() => {
                if (!cancelled) {
                    setLoadingUsersAvailability(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [plannerDetails?.id, userIds, dateStrings]);

    const cinemaQueriesState = useQueries({
        queries: dateStrings.map(date => ({
            queryKey: ["cinema-data", plannerDetails?.cinema_id ?? "", date],
            queryFn: async () => {
                const fetched = await CinemaCityApiClient.getDataInCinemaAtDate(plannerDetails?.cinema_id ?? "", date);
                return fetched as DataInCinemaAtDateResponse;
            },
            enabled: Boolean(plannerDetails?.cinema_id),
            staleTime: 5 * 60 * 1000,
        })),
        combine: (results) => ({
            cinemaDataPerDays: results
                .map(result => result.data)
                .filter((data): data is DataInCinemaAtDateResponse => Boolean(data)),
            loadingCinemaData: results.some(result => result.isLoading),
        }),
    });
    const { cinemaDataPerDays, loadingCinemaData } = cinemaQueriesState;
    
    const events = useMemo<EventProps[]>(() => {
        if (!plannerDetails) {
            return [];
        }

        return calculateEventsToShow(
            cinemaDataPerDays,
            usersAvailabilities,
            plannerDetails.movies,
            plannerDetails.start_hour,
            plannerDetails.end_hour,
        );
    }, [plannerDetails, cinemaDataPerDays, usersAvailabilities]);

    return {
        events,
        weekDates,
        dateStrings,
        loadingCinemaData: loadingCinemaData || loadingUsersAvailability,
    };
};
