import { memo, type FC } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
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
    const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        interactions.onBeginSwipe(dateKey, hour, locked);
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
        interactions.onApplySwipeFromPoint(event.clientX, event.clientY);
    };

    const handlePointerEnd = (event: ReactPointerEvent<HTMLButtonElement>) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        interactions.onEndSwipe();
    };

    return (
        <button
            type="button"
            data-slot="availability"
            data-date-key={dateKey}
            data-hour={hour}
            data-locked={locked}
            onPointerDown={handlePointerDown}
            onPointerEnter={() => interactions.onApplySwipe(dateKey, hour, locked)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
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
