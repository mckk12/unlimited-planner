import { useMemo, useState } from 'react';
import type { AvailabilityDateCell } from '../components/availability';
import { END_HOUR, START_HOUR } from '../utils/availability';
import { normalizeDayDate, startOfWeek, toDateKey } from '../utils/dateUtils';

export const useAvailabilityCalendar = () => {
    const [selectedWeekOffset, setSelectedWeekOffset] = useState<0 | 1>(0);

    const today = useMemo(() => normalizeDayDate(new Date()), []);

    const weekStart = useMemo(() => {
        const currentWeekStart = startOfWeek(today);
        const selectedStart = new Date(currentWeekStart);
        selectedStart.setDate(currentWeekStart.getDate() + selectedWeekOffset * 7);
        return selectedStart;
    }, [selectedWeekOffset, today]);

    const dates = useMemo<AvailabilityDateCell[]>(() => (
        Array.from({ length: 7 }, (_, index) => {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + index);

            return {
                date,
                dateKey: toDateKey(date),
                locked: selectedWeekOffset === 0 ? date < today : false,
            };
        })
    ), [selectedWeekOffset, today, weekStart]);

    const hours = useMemo(
        () => Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, index) => START_HOUR + index),
        [],
    );

    const weekLabel = useMemo(() => {
        const first = dates[0]?.date;
        const last = dates[dates.length - 1]?.date;

        if (!first || !last) {
            return '';
        }

        const formatter = new Intl.DateTimeFormat([], { month: 'short', day: 'numeric' });
        return `${formatter.format(first)} - ${formatter.format(last)}`;
    }, [dates]);

    const dateStrings = useMemo(() => dates.map(date => date.dateKey), [dates]);

    return {
        selectedWeekOffset,
        setSelectedWeekOffset,
        dates,
        hours,
        weekLabel,
        dateStrings,
    };
};
