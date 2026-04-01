import type { SlotState } from '../../utils/availability';

export type { SlotState };

export type AvailabilityDateCell = {
    date: Date;
    dateKey: string;
    locked: boolean;
};

export type SlotInteractionHandlers = {
    onBeginSwipe: (dateKey: string, hour: number, locked: boolean) => void;
    onApplySwipe: (dateKey: string, hour: number, locked: boolean) => void;
    onApplySwipeFromPoint: (x: number, y: number) => void;
    onEndSwipe: () => void;
    onClickSlot: (dateKey: string, hour: number) => void;
};

export type AvailabilityGridSharedProps = {
    dates: AvailabilityDateCell[];
    hours: number[];
    getSlotState: (dateKey: string, hour: number) => SlotState;
    formatHour: (hour: number) => string;
    slotColorClass: (state: SlotState) => string;
    loadingAvailability: boolean;
    interactions: SlotInteractionHandlers;
};
