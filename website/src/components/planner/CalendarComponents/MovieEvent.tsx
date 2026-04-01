import { useState, useRef, useEffect } from "react";
import type { FC } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import PeopleIcon from "./PeopleIcon";
import type { GridEventProps } from "./types";

const AD_TIME = 15; // minutes of ads

const MovieEvent: FC<GridEventProps> = ({ event, startHour, endHour, weekGridRef }) => {
    const eventStartMinutes = new Date(event.dateTime).getHours() * 60 + new Date(event.dateTime).getMinutes();
    const eventEndMinutes = eventStartMinutes + event.screenTime + AD_TIME;
    const windowStartMinutes = startHour * 60;
    const windowEndMinutes = endHour * 60;

    // Intersect event range with visible calendar window to avoid grid overflow.
    const visibleStartMinutes = Math.max(eventStartMinutes, windowStartMinutes);
    const visibleEndMinutes = Math.min(eventEndMinutes, windowEndMinutes);

    const startColumn = visibleStartMinutes - windowStartMinutes + 1;
    const endColumn = visibleEndMinutes - windowStartMinutes + 1;
    const totalVisibleDuration = visibleEndMinutes - visibleStartMinutes;
    const adVisibleStart = Math.max(eventStartMinutes, visibleStartMinutes);
    const adVisibleEnd = Math.min(eventStartMinutes + AD_TIME, visibleEndMinutes);
    const adVisibleDuration = Math.max(0, adVisibleEnd - adVisibleStart);
    const adTimeWidthPercent = totalVisibleDuration > 0 ? (adVisibleDuration / totalVisibleDuration) * 100 : 0;

    const [popupVisible, setPopupVisible] = useState(false);
    const [showAbove, setShowAbove] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const touchMediaQuery = window.matchMedia("(hover: none), (pointer: coarse)");
        const updateTouchState = () => setIsTouchDevice(touchMediaQuery.matches);

        updateTouchState();
        touchMediaQuery.addEventListener("change", updateTouchState);

        return () => {
            touchMediaQuery.removeEventListener("change", updateTouchState);
        };
    }, []);

    useEffect(() => {
        if (popupVisible && containerRef.current && popupRef.current && weekGridRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const weekGridRect = weekGridRef.current.getBoundingClientRect();
            const popupHeight = popupRef.current.offsetHeight;
            const spaceBelow = weekGridRect.bottom - containerRect.bottom;
            
            setShowAbove(spaceBelow < popupHeight);
        }
    }, [popupVisible, weekGridRef]);

    if (visibleEndMinutes <= visibleStartMinutes) {
        return null;
    }


    return (
        <div
            key={event.eventId}
            ref={containerRef}
            className="relative m-0.5 rounded-xl border border-slate-200/40 bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 shadow-[0_10px_22px_rgba(15,23,42,0.35)] ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.45)]"
            style={{ gridColumn: startColumn + "/" + endColumn, zIndex: popupVisible ? 9999 : 'auto' }}
        >
            <div
                className="pointer-events-none absolute inset-y-0 left-0 rounded-l-xl bg-amber-400/30"
                style={{ width: `${adTimeWidthPercent}%` }}
                aria-hidden="true"
            />
            <div 
                className="movie-info relative p-3 flex flex-col h-full cursor-pointer"
                onMouseEnter={() => {
                    if (!isTouchDevice) {
                        setPopupVisible(true);
                    }
                }}
                onMouseLeave={() => {
                    if (!isTouchDevice) {
                        setPopupVisible(false);
                    }
                }}
            >
                <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="movie-event-title text-slate-50 font-semibold text-base leading-tight line-clamp-2 text-left">
                        {event.title}
                    </span>
                    
                    <div className="flex items-center gap-1">
                        {event.people.maybe.length > 0 && (
                            <div className="flex items-center gap-0.5">
                                <PeopleIcon className="w-4 h-4 text-slate-400" />
                                <span className="maybe-go text-xs font-medium text-slate-400">{event.people.maybe.length}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-0.5">
                            <PeopleIcon className="w-4 h-4" />
                            <span className="can-go text-xs font-medium text-slate-100">{event.people.canGo.length}</span>
                        </div>
                        <a 
                            href={event.bookingLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            title="Buy tickets"
                            className="px-2 py-1 bg-emerald-600/80 hover:bg-emerald-500 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faCartShopping} className="text-slate-50"/>
                        </a>
                    </div>
                </div>
                
                <button
                    type="button"
                    className="sm:hidden mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-md border border-slate-200/40 bg-slate-800/70 text-slate-100 w-full"
                    onClick={() => setPopupVisible((prev) => !prev)}
                    aria-expanded={popupVisible}
                >
                    {popupVisible ? "Hide" : "Info"}
                </button>
            </div>
            {popupVisible && (
                <div
                    ref={popupRef}
                    className={`movie-event-popup absolute left-0 min-w-60 rounded-xl border border-slate-200/30 bg-slate-900/95 p-4 text-slate-100 shadow-[0_22px_50px_rgba(15,23,42,0.6)]
                        ${showAbove ? 'bottom-full mb-1' : 'top-full mt-1'}`}
                >
                    <div className="mb-2 flex items-center justify-between sm:hidden">
                        <span className="text-xs font-semibold text-slate-200">Movie details</span>
                        <button
                            type="button"
                            className="rounded-md border border-slate-200/40 p-1 text-xs text-slate-100"
                            onClick={() => setPopupVisible(false)}
                            aria-label="Close movie details"
                        >
                            <FontAwesomeIcon icon={faXmark} className="text-sm text-slate-100" />
                        </button>
                    </div>
                    {/* <h3 className="text-base font-semibold text-slate-50 mb-2">{title}</h3> */}
                    <p className="text-xs text-slate-300/90 mb-2">
                        🕐 {new Date(event.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         - 
                        {new Date(new Date(event.dateTime).getTime() + event.screenTime * 60000 + AD_TIME * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm font-medium text-slate-200 mb-3">
                        🎫 Seats availability: <span className="text-emerald-200">{Math.round(100 * event.availabilityRatio)}%</span>
                    </p>
                    {event.attributeIds.length > 0 && (
                        <>
                        <p className="text-xs font-semibold text-slate-300/90 mb-2">Attributes:</p>
                        <p className="text-xs text-slate-400 mb-3">
                            {event.attributeIds.join(", ")}
                        </p>
                        </>
                    )}
                    {event.people.canGo.length > 0 && (
                        <>
                        <p className="text-xs font-semibold text-slate-300/90 mb-2">People who can go:</p>
                        <ul className="space-y-1">
                            {event.people.canGo.map((person, index) => (
                                <li key={index} className="text-xs text-slate-200/90 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-slate-200/70 rounded-full"></span>
                                    {person}
                                </li>
                            ))}
                        </ul>
                        </>
                    )}
                    {event.people.maybe.length > 0 && (
                        <>
                        <p className="text-xs font-semibold text-slate-300/90 mt-3 mb-2">People who might go:</p>
                        <ul className="space-y-1">
                            {event.people.maybe.map((person, index) => (
                                <li key={index} className="text-xs text-slate-200/70 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-slate-200/50 rounded-full"></span>
                                    {person}
                                </li>
                            ))}
                        </ul>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default MovieEvent;