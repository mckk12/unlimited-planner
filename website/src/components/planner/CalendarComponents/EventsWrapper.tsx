import type { FC } from 'react';
import { memo } from 'react';
import type { EventsWrapperProps } from './types';
import MovieEvent from './MovieEvent';

const EventsWrapper: FC<EventsWrapperProps> = ({ startHour, endHour, events, weekGridRef }) => {
    return (
        <div
            className="events-wrapper border-l border-slate-800/70 bg-linear-to-r from-slate-950/80 via-slate-900/50 to-slate-950/80"
            style={{
                gridRow: "2",
                gridColumn: "2/" + ((endHour - startHour) * 60 + 2),
                display: "grid",
                gridTemplateColumns: "repeat(" + ((endHour - startHour) * 60 + 1) + ", 3px)",
            }}
        >
            {events.map((event) => (
                <MovieEvent key={event.eventId} event={event} startHour={startHour} endHour={endHour} weekGridRef={weekGridRef} />
            ))}
        </div>
    );
}

export default memo(EventsWrapper);