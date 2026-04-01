import type { FC } from 'react';
import {
    AvailabilityControls,
    AvailabilityDesktopGrid,
    AvailabilityMobileColumns,
} from '../components/availability';
import { useAvailabilityEditor } from '../hooks/useAvailabilityEditor';
import { useAuth } from '../hooks/useAuth';
import { useSnackbar } from '../hooks/useSnackbar';

const Availability: FC = () => {
    const { user } = useAuth();
    const { showSnackbar } = useSnackbar();
    const {
        selectedWeekOffset,
        setSelectedWeekOffset,
        dates,
        hours,
        weekLabel,
        loadingAvailability,
        isSaving,
        isDirty,
        getSlotState,
        formatHour,
        slotColorClass,
        interactions,
        saveAvailability,
        refreshAvailability,
        setWholeWeekNotAvailable,
    } = useAvailabilityEditor({
        userId: user?.id,
        showSnackbar,
    });


    return (
        <div className="p-4 sm:p-6">
            <div className="mx-auto max-w-7xl space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-100">My availability</h1>
                        {/* <p className="text-sm text-slate-400">Select each time slot: red = not available, yellow = maybe, green = can go.</p> */}
                        <p className="mt-1 text-xs text-slate-500">Week: {weekLabel}</p>
                    </div>
                </div>

                <AvailabilityControls
                    selectedWeekOffset={selectedWeekOffset}
                    setSelectedWeekOffset={setSelectedWeekOffset}
                    loadingAvailability={loadingAvailability}
                    isSaving={isSaving}
                    isDirty={isDirty}
                    hasUser={Boolean(user)}
                    onSave={saveAvailability}
                    onRefresh={refreshAvailability}
                    onSetNotAvailable={setWholeWeekNotAvailable}
                />

                <AvailabilityMobileColumns
                    dates={dates}
                    hours={hours}
                    getSlotState={getSlotState}
                    formatHour={formatHour}
                    slotColorClass={slotColorClass}
                    loadingAvailability={loadingAvailability}
                    interactions={interactions}
                />

                <AvailabilityDesktopGrid
                    dates={dates}
                    hours={hours}
                    getSlotState={getSlotState}
                    formatHour={formatHour}
                    slotColorClass={slotColorClass}
                    loadingAvailability={loadingAvailability}
                    interactions={interactions}
                />
            </div>
        </div>
    );
}

export default Availability;