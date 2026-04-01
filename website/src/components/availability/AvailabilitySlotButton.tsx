import { memo, type FC } from 'react';
import type { SlotInteractionHandlers, SlotState } from './types';

type AvailabilitySlotButtonProps = {
    dateKey: string;
    hour: number;
    locked: boolean;
    loadingAvailability: boolean;
    slotState: SlotState;
    hourLabel: string;
    colorClass: string;
    interactions: SlotInteractionHandlers;
    sizeClass?: string;
};

const AvailabilitySlotButton: FC<AvailabilitySlotButtonProps> = ({
    dateKey,
    hour,
    locked,
    loadingAvailability,
    slotState,
    hourLabel,
    colorClass,
    interactions,
    sizeClass = 'h-8',
}) => {
    return (
        <button
            type="button"
            data-slot="availability"
            data-date-key={dateKey}
            data-hour={hour}
            data-locked={locked}
            onPointerDown={event => {
                event.preventDefault();
                interactions.onBeginSwipe(dateKey, hour, locked);
            }}
            onPointerEnter={() => interactions.onApplySwipe(dateKey, hour, locked)}
            onPointerMove={() => interactions.onApplySwipe(dateKey, hour, locked)}
            onTouchStart={event => {
                if (typeof window !== 'undefined' && 'PointerEvent' in window) {
                    return;
                }

                if (event.cancelable) {
                    event.preventDefault();
                }
                interactions.onBeginSwipe(dateKey, hour, locked);
            }}
            onTouchMove={event => {
                if (typeof window !== 'undefined' && 'PointerEvent' in window) {
                    return;
                }

                if (event.cancelable) {
                    event.preventDefault();
                }

                const touch = event.touches[0];
                if (touch) {
                    interactions.onApplySwipeFromPoint(touch.clientX, touch.clientY);
                }
            }}
            onTouchEnd={() => {
                if (typeof window !== 'undefined' && 'PointerEvent' in window) {
                    return;
                }
                interactions.onEndSwipe();
            }}
            onTouchCancel={() => {
                if (typeof window !== 'undefined' && 'PointerEvent' in window) {
                    return;
                }
                interactions.onEndSwipe();
            }}
            onClick={event => {
                if (event.detail === 0) {
                    interactions.onClickSlot(dateKey, hour);
                }
            }}
            disabled={locked || loadingAvailability}
            className={`${sizeClass} cursor-pointer w-full select-none touch-none rounded border text-[11px] font-semibold text-slate-900 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${colorClass}`}
            title={locked ? 'Past date is locked' : `${slotState} (click to cycle)`}
        >
            {hourLabel}
        </button>
    );
};

export default memo(AvailabilitySlotButton);
