import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SnackbarContextType } from '../contexts';
import { availabilityService } from '../services/supabaseClient';
import {
    cloneAvailabilityByDate,
    cycleSlotState,
    emptyAvailability,
    getSlotStateForDate,
    type AvailabilityByDate,
    type SlotState,
} from '../utils/availability';
import type { AvailabilityPayload } from '../utils/types';
import type { AvailabilityDateCell } from '../components/availability';

type UseAvailabilityDataParams = {
    userId?: string;
    dateStrings: string[];
    dates: AvailabilityDateCell[];
    showSnackbar: SnackbarContextType['showSnackbar'];
};

export const useAvailabilityData = ({ userId, dateStrings, dates, showSnackbar }: UseAvailabilityDataParams) => {
    const [availabilityByDate, setAvailabilityByDate] = useState<AvailabilityByDate>({});
    const [initialAvailabilityByDate, setInitialAvailabilityByDate] = useState<AvailabilityByDate>({});
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const isDirty = useMemo(
        () => JSON.stringify(availabilityByDate) !== JSON.stringify(initialAvailabilityByDate),
        [availabilityByDate, initialAvailabilityByDate],
    );

    useEffect(() => {
        if (!userId) {
            setAvailabilityByDate({});
            setInitialAvailabilityByDate({});
            setLoadingAvailability(false);
            return;
        }

        let cancelled = false;
        setLoadingAvailability(true);

        availabilityService.getUserAvailabilities(userId, dateStrings)
            .then(data => {
                if (cancelled) {
                    return;
                }

                const fetched = (data || []) as Array<{ date: string; availability: AvailabilityPayload }>;
                const nextByDate: AvailabilityByDate = {};

                for (const { date, availability } of fetched) {
                    nextByDate[date] = {
                        canGo: [...(availability?.canGo || [])],
                        maybe: [...(availability?.maybe || [])],
                    };
                }

                for (const date of dateStrings) {
                    if (!nextByDate[date]) {
                        nextByDate[date] = emptyAvailability();
                    }
                }

                const normalizedByDate = cloneAvailabilityByDate(nextByDate);

                setAvailabilityByDate(normalizedByDate);
                setInitialAvailabilityByDate(cloneAvailabilityByDate(normalizedByDate));
            })
            .catch(error => {
                if (cancelled) {
                    return;
                }

                console.error('Error fetching user availability:', error);
                showSnackbar('Could not load availability', 'error');
            })
            .finally(() => {
                if (!cancelled) {
                    setLoadingAvailability(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [dateStrings, userId]); // eslint-disable-line react-hooks/exhaustive-deps

    const getSlotState = useCallback(
        (dateKey: string, hour: number) => getSlotStateForDate(availabilityByDate, dateKey, hour),
        [availabilityByDate],
    );

    const setSlotState = useCallback((dateKey: string, hour: number, nextState: SlotState) => {
        setAvailabilityByDate(prev => {
            const currentDay = prev[dateKey] || emptyAvailability();
            const nextCanGo = currentDay.canGo.filter(value => value !== hour);
            const nextMaybe = currentDay.maybe.filter(value => value !== hour);

            if (nextState === 'canGo') {
                nextCanGo.push(hour);
            } else if (nextState === 'maybe') {
                nextMaybe.push(hour);
            }

            nextCanGo.sort((a, b) => a - b);
            nextMaybe.sort((a, b) => a - b);

            return {
                ...prev,
                [dateKey]: {
                    canGo: nextCanGo,
                    maybe: nextMaybe,
                },
            };
        });
    }, []);

    const handleSlotClick = useCallback((dateKey: string, hour: number) => {
        const current = getSlotState(dateKey, hour);
        setSlotState(dateKey, hour, cycleSlotState(current));
    }, [getSlotState, setSlotState]);

    const saveAvailability = useCallback(async () => {
        if (!userId) {
            return;
        }

        setIsSaving(true);
        try {
            const unlockedDates = dates
                .filter(date => !date.locked)
                .map(date => date.dateKey);

            await Promise.all(
                unlockedDates.map(dateKey => (
                    availabilityService.setUserAvailability(userId, dateKey, availabilityByDate[dateKey] || emptyAvailability())
                )),
            );

            setInitialAvailabilityByDate(cloneAvailabilityByDate(availabilityByDate));
            showSnackbar('Availability saved', 'success');
        } catch (error) {
            console.error('Error saving availability:', error);
            showSnackbar('Could not save availability', 'error');
        } finally {
            setIsSaving(false);
        }
    }, [availabilityByDate, dates, showSnackbar, userId]);

    const refreshAvailability = useCallback(() => {
        setAvailabilityByDate(cloneAvailabilityByDate(initialAvailabilityByDate));
        showSnackbar('Changes reverted', 'info');
    }, [initialAvailabilityByDate, showSnackbar]);

    const setWholeWeekNotAvailable = useCallback(async () => {
        if (!userId) {
            return;
        }

        setIsSaving(true);
        try {
            const unlockedDates = dates.filter(date => !date.locked).map(date => date.dateKey);
            
            // Set all unlocked dates to empty availability
            await Promise.all(
                unlockedDates.map(dateKey =>
                    availabilityService.setUserAvailability(userId, dateKey, emptyAvailability())
                ),
            );

            // Update state to reflect the changes
            const updated: AvailabilityByDate = {};
            for (const date of dateStrings) {
                updated[date] = availabilityByDate[date] || emptyAvailability();
                if (unlockedDates.includes(date)) {
                    updated[date] = emptyAvailability();
                }
            }
            
            setAvailabilityByDate(updated);
            setInitialAvailabilityByDate(cloneAvailabilityByDate(updated));
            showSnackbar('Marked whole week as unavailable', 'success');
        } catch (error) {
            console.error('Error setting week as unavailable:', error);
            showSnackbar('Could not mark week as unavailable', 'error');
        } finally {
            setIsSaving(false);
        }
    }, [userId, dates, dateStrings, availabilityByDate, showSnackbar]);

    return {
        loadingAvailability,
        isSaving,
        isDirty,
        getSlotState,
        setSlotState,
        handleSlotClick,
        saveAvailability,
        refreshAvailability,
        setWholeWeekNotAvailable,
    };
};
