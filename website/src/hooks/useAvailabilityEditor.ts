import type { SnackbarContextType } from '../contexts';
import { formatAvailabilityHour, getSlotColorClass } from '../utils/availability';
import { useAvailabilityCalendar } from './useAvailabilityCalendar';
import { useAvailabilityData } from './useAvailabilityData';
import { useAvailabilityInteractions } from './useAvailabilityInteractions';

type UseAvailabilityEditorParams = {
    userId?: string;
    showSnackbar: SnackbarContextType['showSnackbar'];
};

export const useAvailabilityEditor = ({ userId, showSnackbar }: UseAvailabilityEditorParams) => {
    const { selectedWeekOffset, setSelectedWeekOffset, dates, hours, weekLabel, dateStrings } = useAvailabilityCalendar();

    const {
        loadingAvailability,
        isSaving,
        isDirty,
        getSlotState,
        setSlotState,
        handleSlotClick,
        saveAvailability,
        refreshAvailability,
        setWholeWeekNotAvailable,
    } = useAvailabilityData({
        userId,
        dateStrings,
        dates,
        showSnackbar,
    });

    const { interactions } = useAvailabilityInteractions({
        loadingAvailability,
        getSlotState,
        setSlotState,
        handleSlotClick,
    });

    return {
        selectedWeekOffset,
        setSelectedWeekOffset,
        dates,
        hours,
        weekLabel,
        loadingAvailability,
        isSaving,
        isDirty,
        getSlotState,
        formatHour: formatAvailabilityHour,
        slotColorClass: getSlotColorClass,
        interactions,
        saveAvailability,
        refreshAvailability,
        setWholeWeekNotAvailable,
    };
};
