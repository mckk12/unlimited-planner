import { useRef, useEffect } from "react";
import type { FC } from 'react';
import Day from "./Day";
import type { WeekProps } from './types';


const Week: FC<WeekProps> = ({ events, startDate, startHour, endHour, days }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const weekDays = [];
    for (let i = 0; i < days; i++) {
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + i);
        weekDays.push(dayDate);
    }

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleWheel = (event: WheelEvent) => {
            const hasHorizontalScroll = container.scrollWidth > container.clientWidth;
            if (!hasHorizontalScroll) return;

            // Prevent page scroll when hovering over the week grid
            event.preventDefault();
            event.stopPropagation();

            const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
            container.scrollLeft += delta;
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, []);

    return (
        <div
            ref={scrollRef}
            className="week-grid grid overflow-x-auto pb-2 pr-6 rounded-2xl border border-slate-800/80 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 shadow-[0_30px_80px_rgba(2,6,23,0.6)]"
            style={{ gridTemplateRows: `2rem repeat(${days}, auto)`, scrollbarWidth: "auto", scrollbarColor: "rgba(148, 163, 184, 0.8) transparent"}}
        >
            {weekDays.map((date, index) => (
                <Day key={index} gridOrder={index} date={date} startHour={startHour} endHour={endHour} weekGridRef={scrollRef} events={events.filter(event => {
                    const eventDate = new Date(event.dateTime);
                    return eventDate.getFullYear() === date.getFullYear() &&
                           eventDate.getMonth() === date.getMonth() &&
                           eventDate.getDate() === date.getDate();
                })} />
            ))}
        </div>
    );
}

export default Week;