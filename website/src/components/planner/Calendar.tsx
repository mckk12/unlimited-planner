import { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import Week from './CalendarComponents/Week';
import WeekSelector from './CalendarComponents/WeekSelector';
import FilterDropdown from './CalendarComponents/FilterDropdown';
import ExcludeDropdown from './CalendarComponents/ExcludeDropdown';
import ActiveFilters from './CalendarComponents/ActiveFilters';
import type { CalendarProps, CalendarHandle } from './CalendarComponents/types';
import { useAttributesDescriptions } from '../../hooks/useCinemaData';
import { startOfWeek } from '../../utils/dateUtils';

const END_HOUR_MARGIN = 2; // hours to add to end hour for better event display

const Calendar = forwardRef<CalendarHandle, CalendarProps>(({ startHour, endHour, events, onDateChange}, ref) => {
    const [selectedWeekOffset, setSelectedWeekOffset] = useState<0 | 1>(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isExcludeDropdownOpen, setIsExcludeDropdownOpen] = useState(false);
    const [selectedAttributes, setSelectedAttributes] = useState<Set<string>>(new Set());
    const [excludedAttributes, setExcludedAttributes] = useState<Set<string>>(new Set(['vip', '4dx']));
    const { attributes: attributeGroups } = useAttributesDescriptions();

    const date = useMemo(() => {
        const next = startOfWeek(new Date());
        next.setDate(next.getDate() + selectedWeekOffset * 7);
        return next;
    }, [selectedWeekOffset]);

    // Get all unique attribute IDs present in events
    const allEventAttributes = useMemo(() => {
        const attrs = new Set<string>();
        events.forEach(event => {
            event.attributeIds.forEach(attrId => attrs.add(attrId));
        });
        return attrs;
    }, [events]);

    // Filter attribute groups to only show ones that are present in current events
    const activeAttributeGroups = useMemo(() => {
        const excludedGroups = new Set(['age-restriction', 'extra', 'screening-addons', 'genres']);
        
        return attributeGroups
            .filter(group => !excludedGroups.has(group["group-name"]))
            .map(group => ({
                ...group,
                items: group.items.filter(item => allEventAttributes.has(item.id))
            }))
            .filter(group => group.items.length > 0);
    }, [attributeGroups, allEventAttributes]);

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            // Must contain all selected attributes (if any selected)
            if (selectedAttributes.size > 0) {
                const containsAll = Array.from(selectedAttributes).every(attrId => 
                    event.attributeIds.includes(attrId)
                );
                if (!containsAll) return false;
            }

            // Must not contain any excluded attributes
            if (excludedAttributes.size > 0) {
                const containsExcluded = Array.from(excludedAttributes).some(attrId => 
                    event.attributeIds.includes(attrId)
                );
                if (containsExcluded) return false;
            }

            return true;
        });
    }, [events, selectedAttributes, excludedAttributes]);

    const toggleAttribute = (attributeId: string) => {
        setSelectedAttributes(prev => {
            const next = new Set(prev);
            if (next.has(attributeId)) {
                next.delete(attributeId);
            } else {
                next.add(attributeId);
            }
            return next;
        });
    };

    const toggleExcludedAttribute = (attributeId: string) => {
        setExcludedAttributes(prev => {
            const next = new Set(prev);
            if (next.has(attributeId)) {
                next.delete(attributeId);
            } else {
                next.add(attributeId);
            }
            return next;
        });
    };

    const clearFilters = () => {
        setSelectedAttributes(new Set());
    };

    const clearExcludeFilters = () => {
        setExcludedAttributes(new Set());
    };

    useEffect(() => {
        onDateChange?.(date);
    }, [date, onDateChange]);

    useImperativeHandle(ref, () => ({ date }), [date]);

    return (
        <div className="calendar-container relative rounded-2xl p-4 bg-slate-800">
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center justify-between">
                    <WeekSelector 
                        selectedWeekOffset={selectedWeekOffset} 
                        onWeekChange={setSelectedWeekOffset}
                    />

                    <div className="relative z-20 flex gap-2">
                        <FilterDropdown
                            isOpen={isDropdownOpen}
                            onToggleOpen={() => setIsDropdownOpen(!isDropdownOpen)}
                            activeAttributeGroups={activeAttributeGroups}
                            selectedAttributes={selectedAttributes}
                            onToggleAttribute={toggleAttribute}
                            onClearFilters={clearFilters}
                        />

                        <ExcludeDropdown
                            isOpen={isExcludeDropdownOpen}
                            onToggleOpen={() => setIsExcludeDropdownOpen(!isExcludeDropdownOpen)}
                            activeAttributeGroups={activeAttributeGroups}
                            excludedAttributes={excludedAttributes}
                            onToggleAttribute={toggleExcludedAttribute}
                            onClearExclusions={clearExcludeFilters}
                        />
                    </div>
                </div>

                <ActiveFilters
                    selectedAttributes={selectedAttributes}
                    excludedAttributes={excludedAttributes}
                    onToggleAttribute={toggleAttribute}
                    onToggleExcludedAttribute={toggleExcludedAttribute}
                />
            </div>

            <Week events={filteredEvents} startDate={date} startHour={startHour} endHour={endHour+END_HOUR_MARGIN} days={7} />
        </div>
    );
});

export default Calendar;