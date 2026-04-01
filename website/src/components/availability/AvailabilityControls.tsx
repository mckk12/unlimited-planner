import { memo, type FC } from 'react';

type AvailabilityControlsProps = {
    selectedWeekOffset: 0 | 1;
    setSelectedWeekOffset: (value: 0 | 1) => void;
    loadingAvailability: boolean;
    isSaving: boolean;
    isDirty: boolean;
    hasUser: boolean;
    onSave: () => void;
    onRefresh: () => void;
    onSetNotAvailable: () => void;
};

const AvailabilityControls: FC<AvailabilityControlsProps> = ({
    selectedWeekOffset,
    setSelectedWeekOffset,
    loadingAvailability,
    isSaving,
    isDirty,
    hasUser,
    onSave,
    onRefresh,
    onSetNotAvailable,
}) => {
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-red-500" /> Not Available</span>
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-yellow-500" /> Maybe</span>
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-green-500" /> Available</span>
                {loadingAvailability && (
                    <span className="inline-flex items-center gap-2 text-cyan-300">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
                        Loading...
                    </span>
                )}
            </div>

            <div className="grid gap-2 md:grid-cols-[auto_auto] md:items-center md:justify-between">
                <div className="grid grid-cols-2 rounded-lg border border-slate-700 bg-slate-900/70 p-1">
                    <button
                        type="button"
                        onClick={() => setSelectedWeekOffset(0)}
                        className={`cursor-pointer rounded-md px-3 py-2 text-xs font-semibold transition-colors ${selectedWeekOffset === 0 ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                        Current week
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedWeekOffset(1)}
                        className={`cursor-pointer rounded-md px-3 py-2 text-xs font-semibold transition-colors ${selectedWeekOffset === 1 ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                        Next week
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2 md:flex md:items-center">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={!hasUser || isSaving || loadingAvailability || !isDirty}
                        className="cursor-pointer w-full min-w-20 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={!hasUser || loadingAvailability || !isDirty}
                        className="cursor-pointer w-full min-w-20 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Revert
                    </button>
                    <button
                        type="button"
                        onClick={onSetNotAvailable}
                        disabled={!hasUser || loadingAvailability || isSaving}
                        className="cursor-pointer w-full min-w-30 rounded-lg border border-red-600 bg-red-600/10 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? 'Saving...' : 'Unavailable'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(AvailabilityControls);
