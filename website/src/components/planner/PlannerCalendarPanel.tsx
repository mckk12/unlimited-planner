import { memo, type FC, type RefObject } from "react";
import Calendar from "./Calendar";
import { type CalendarHandle, type EventProps } from "./CalendarComponents/types";

type PlannerCalendarPanelProps = {
    calendarRef: RefObject<CalendarHandle | null>;
    startHour?: number;
    endHour?: number;
    events: EventProps[];
    isLoading: boolean;
    onDateChange?: (date: Date) => void;
};

const PlannerCalendarPanel: FC<PlannerCalendarPanelProps> = ({
    calendarRef,
    startHour,
    endHour,
    events,
    isLoading,
    onDateChange,
}) => {
    if (isLoading || startHour === undefined || endHour === undefined) {
        return (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-700/50 bg-slate-900/70">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-500 border-t-cyan-400"></div>
            </div>
        );
    }

    return <Calendar ref={calendarRef} startHour={startHour} endHour={endHour} events={events} onDateChange={onDateChange} />;
};

export default memo(PlannerCalendarPanel);