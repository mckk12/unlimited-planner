import type { AvailabilityPayload } from './types';

export const START_HOUR = 8;
export const END_HOUR = 23;

export type SlotState = 'not' | 'maybe' | 'canGo';
export type AvailabilityByDate = Record<string, AvailabilityPayload>;

export const emptyAvailability = (): AvailabilityPayload => ({
    canGo: [],
    maybe: [],
});

export const cloneAvailabilityByDate = (source: AvailabilityByDate): AvailabilityByDate => {
    const copy: AvailabilityByDate = {};

    for (const [dateKey, value] of Object.entries(source)) {
        copy[dateKey] = {
            canGo: [...(value?.canGo || [])],
            maybe: [...(value?.maybe || [])],
        };
    }

    return copy;
};

export const getSlotStateForDate = (availabilityByDate: AvailabilityByDate, dateKey: string, hour: number): SlotState => {
    const dayAvailability = availabilityByDate[dateKey] || emptyAvailability();

    if (dayAvailability.canGo.includes(hour)) {
        return 'canGo';
    }

    if (dayAvailability.maybe.includes(hour)) {
        return 'maybe';
    }

    return 'not';
};

export const cycleSlotState = (current: SlotState): SlotState => {
    if (current === 'not') {
        return 'maybe';
    }

    if (current === 'maybe') {
        return 'canGo';
    }

    return 'not';
};

export const formatAvailabilityHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;

export const getSlotColorClass = (state: SlotState) => {
    if (state === 'canGo') {
        return 'bg-green-500 hover:bg-green-400 border-green-400';
    }

    if (state === 'maybe') {
        return 'bg-yellow-500 hover:bg-yellow-400 border-yellow-400';
    }

    return 'bg-red-500 hover:bg-red-400 border-red-400';
};
