import { memo, type FC } from 'react';
import AvailabilitySlotButton from './AvailabilitySlotButton';
import type { AvailabilityGridSharedProps } from './types';

const AvailabilityMobileColumns: FC<AvailabilityGridSharedProps> = ({
    dates,
    hours,
    getSlotState,
    formatHour,
    slotColorClass,
    loadingAvailability,
    interactions,
}) => {
    return (
        <div className={`space-y-2 md:hidden transition-opacity ${loadingAvailability ? 'opacity-70' : 'opacity-100'}`}>
            {dates.map(({ date, dateKey, locked }) => {
                const dayLabel = date.toLocaleDateString(['pl-PL', 'en-US'], { weekday: 'long', month: 'short', day: 'numeric' });

                return (
                    <details key={dateKey} className="rounded-xl border border-slate-800 bg-slate-900/70 p-2">
                        <summary className="cursor-pointer list-none select-none rounded px-2 py-2 text-sm font-semibold text-slate-200">
                            <div className="flex items-center justify-between gap-3">
                                <span>{dayLabel}</span>
                                {locked && <span className="text-[10px] uppercase text-slate-500">Locked</span>}
                            </div>
                        </summary>
                        <div className="mt-2 grid grid-cols-2 gap-1 sm:grid-cols-3">
                            {hours.map(hour => {
                                const slotState = getSlotState(dateKey, hour);
                                return (
                                    <div key={`${dateKey}-${hour}`} className="rounded p-0.5">
                                        <AvailabilitySlotButton
                                            dateKey={dateKey}
                                            hour={hour}
                                            locked={locked}
                                            loadingAvailability={loadingAvailability}
                                            slotState={slotState}
                                            hourLabel={formatHour(hour)}
                                            colorClass={slotColorClass(slotState)}
                                            interactions={interactions}
                                            sizeClass="h-9"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </details>
                );
            })}
        </div>
    );
};

export default memo(AvailabilityMobileColumns);
