import { memo, type FC } from 'react';
import AvailabilitySlotButton from './AvailabilitySlotButton';
import type { AvailabilityGridSharedProps } from './types';

const AvailabilityDesktopGrid: FC<AvailabilityGridSharedProps> = ({
    dates,
    hours,
    getSlotState,
    formatHour,
    slotColorClass,
    loadingAvailability,
    interactions,
}) => {
    return (
        <div className={`hidden overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70 p-2 transition-opacity md:block ${loadingAvailability ? 'opacity-70' : 'opacity-100'}`}>
            <table className="w-full min-w-240 border-separate border-spacing-1 text-center">
                <thead>
                    <tr>
                        {dates.map(({ date, dateKey }) => (
                            <th key={dateKey} className="rounded bg-slate-800 px-2 py-2 text-xs font-semibold text-slate-200">
                                <div>{date.toLocaleDateString(['pl-PL', 'en-US'], { weekday: 'short' })}</div>
                                <div className="text-slate-400">{date.toLocaleDateString(['pl-PL', 'en-US'], { month: 'short', day: 'numeric' })}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {hours.map(hour => (
                        <tr key={hour}>
                            {dates.map(({ dateKey, locked }) => {
                                const slotState = getSlotState(dateKey, hour);
                                return (
                                    <td key={`${dateKey}-${hour}`} className="rounded p-0.5">
                                        <AvailabilitySlotButton
                                            dateKey={dateKey}
                                            hour={hour}
                                            locked={locked}
                                            loadingAvailability={loadingAvailability}
                                            slotState={slotState}
                                            hourLabel={formatHour(hour)}
                                            colorClass={slotColorClass(slotState)}
                                            interactions={interactions}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default memo(AvailabilityDesktopGrid);
