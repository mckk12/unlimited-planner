import type { FC } from 'react';
import { memo } from 'react';
import EventsWrapper from './EventsWrapper';
import type { DayGridProps } from './types';

const START_COL = 2;

const DayGrid: FC<DayGridProps> = ({ gridOrder, date, startHour, endHour, events, weekGridRef }) => {
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dateDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const isToday = todayDateOnly.getTime() === dateDateOnly.getTime();
    const isPast = dateDateOnly < todayDateOnly;
    const hourLabels = [];   
    for (let k = 0; k <= endHour-startHour-1; k++) {
        const hour = startHour + k;
        hourLabels.push(
            <div
                key={hour}
                className="hour-label inline-flex flex-col-reverse text-xs text-slate-400"
                style={{ gridColumn: (k * 60 + START_COL) + "/" + (k * 60 + START_COL), gridRow: "1" }}
            >
                <span>{hour}:00</span>
            </div>
        );
    }   
    const gridLines = [];
    for (let k = 0; k <= (endHour-startHour)*2; k++) {
        gridLines.push(
            <div
                key={k}
                className="hour-grid-line border-l border-slate-700/60 w-0"
                style={{
                    gridColumn: (k * 30 + START_COL) + "/" + (k * 30 + START_COL),
                    gridRow: "2/3",
                    borderLeftStyle: k % 2 === 0 ? "solid" : "dotted",
                }}
            ></div>
        );
    }

    return (
        <div
            className={`day-grid grid border-t border-slate-800/60 ${isToday ? 'bg-slate-400' : ''} ${isPast ? 'bg-slate-800/60 opacity-70' : ''}`}
            style={{
                gridRow: gridOrder+2,
                gridTemplateRows: "0 1fr",
                gridTemplateColumns: "100px repeat(" + ((endHour - startHour) * 60) + ", 3px)",
            }}
        >
            <span
                className={`date-label sticky left-0 z-10 p-2 text-center text-base font-semibold tracking-wide uppercase border-slate-800/80 ${isPast ? 'bg-slate-800 text-slate-400' : 'text-slate-100 bg-slate-950/90'}`}
                style={{ gridColumn: "1", gridRow: "2" }}
            >
                <span className={`block text-xs ${isPast ? 'text-slate-500' : 'text-slate-400/90'}`}>
                    {date.toLocaleDateString([], { weekday: 'long' })}
                </span>
                <span className={`block text-base font-semibold tracking-wide ${isPast ? 'text-slate-300' : 'text-slate-100'}`}>
                    {date.toLocaleDateString([], { month: 'long', day: 'numeric' })}
                </span>
            </span>
            {gridOrder===0 ? hourLabels : null}
            {gridLines}
            <EventsWrapper startHour={startHour} endHour={endHour} events={events} weekGridRef={weekGridRef} />
        </div>
    );
};

export default memo(DayGrid);