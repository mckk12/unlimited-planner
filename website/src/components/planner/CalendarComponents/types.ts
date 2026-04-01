import type { RefObject } from 'react';

// connects movie event information with calculated people availability turned to only ones that can go and maybe can go
export interface EventProps {
    eventId: number;
    title: string;
    bookingLink: string;
    dateTime: Date;
    screenTime: number; // in minutes
    availabilityRatio: number; // from 0 to 1
    people: {
        maybe: string[];
        canGo: string[];
    };
    attributeIds: string[];
}

export interface GridEventProps {
    event: EventProps;
    startHour: number;
    endHour: number;
    weekGridRef: RefObject<HTMLDivElement | null>;
}

export interface DayGridProps {
    gridOrder: number;
    date: Date;
    startHour: number;
    endHour: number;
    events: EventProps[];
    weekGridRef: RefObject<HTMLDivElement | null>;
}

export interface EventsWrapperProps {
    startHour: number;
    endHour: number;
    events: EventProps[];
    weekGridRef: RefObject<HTMLDivElement | null>;
}

export interface WeekProps {
    events: EventProps[];
    startDate: Date;
    startHour: number;
    endHour: number;
    days: number;
}

export interface CalendarProps {
    events: EventProps[];
    startHour: number;
    endHour: number;
    onDateChange?: (date: Date) => void;
}

export interface CalendarHandle {
    date: Date;
}