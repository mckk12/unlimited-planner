import { useCallback, useMemo, useRef } from 'react';
import type { SlotInteractionHandlers, SlotState } from '../components/availability';
import { cycleSlotState } from '../utils/availability';

type UseAvailabilityInteractionsParams = {
    loadingAvailability: boolean;
    getSlotState: (dateKey: string, hour: number) => SlotState;
    setSlotState: (dateKey: string, hour: number, nextState: SlotState) => void;
    handleSlotClick: (dateKey: string, hour: number) => void;
};

export const useAvailabilityInteractions = ({
    loadingAvailability,
    getSlotState,
    setSlotState,
    handleSlotClick,
}: UseAvailabilityInteractionsParams) => {
    const isSwipingRef = useRef(false);
    const swipeStateRef = useRef<SlotState | null>(null);
    const touchedSlotsRef = useRef<Set<string>>(new Set());

    const endSwipe = useCallback(() => {
        isSwipingRef.current = false;
        swipeStateRef.current = null;
        touchedSlotsRef.current.clear();
    }, []);

    const applySwipeToSlot = useCallback((dateKey: string, hour: number, locked: boolean) => {
        if (!isSwipingRef.current || !swipeStateRef.current || locked || loadingAvailability) {
            return;
        }

        const slotId = `${dateKey}-${hour}`;
        if (touchedSlotsRef.current.has(slotId)) {
            return;
        }

        touchedSlotsRef.current.add(slotId);
        setSlotState(dateKey, hour, swipeStateRef.current);
    }, [loadingAvailability, setSlotState]);

    const applySwipeFromPoint = useCallback((x: number, y: number) => {
        if (typeof document === 'undefined') {
            return;
        }

        const element = document.elementFromPoint(x, y);
        const slotButton = element?.closest('button[data-slot="availability"]') as HTMLButtonElement | null;

        if (!slotButton) {
            return;
        }

        const dateKey = slotButton.dataset.dateKey;
        const hour = Number(slotButton.dataset.hour);
        const locked = slotButton.dataset.locked === 'true';

        if (!dateKey || Number.isNaN(hour)) {
            return;
        }

        applySwipeToSlot(dateKey, hour, locked);
    }, [applySwipeToSlot]);

    const beginSwipe = useCallback((dateKey: string, hour: number, locked: boolean) => {
        if (locked || loadingAvailability) {
            return;
        }

        const nextState = cycleSlotState(getSlotState(dateKey, hour));
        isSwipingRef.current = true;
        swipeStateRef.current = nextState;
        touchedSlotsRef.current.clear();

        applySwipeToSlot(dateKey, hour, locked);
    }, [applySwipeToSlot, getSlotState, loadingAvailability]);

    const interactions = useMemo<SlotInteractionHandlers>(() => ({
        onBeginSwipe: beginSwipe,
        onApplySwipe: applySwipeToSlot,
        onApplySwipeFromPoint: applySwipeFromPoint,
        onEndSwipe: endSwipe,
        onClickSlot: handleSlotClick,
    }), [applySwipeFromPoint, applySwipeToSlot, beginSwipe, endSwipe, handleSlotClick]);

    return { interactions };
};
