import { memo, type FC } from 'react';

interface WeekSelectorProps {
    selectedWeekOffset: 0 | 1;
    onWeekChange: (offset: 0 | 1) => void;
}

const WeekSelector: FC<WeekSelectorProps> = memo(({ selectedWeekOffset, onWeekChange }) => {
    return (
        <div className="grid grid-cols-2 w-fit rounded-lg border border-slate-700 bg-slate-900/70 p-1">
            <button
                type="button"
                onClick={() => onWeekChange(0)}
                className={`cursor-pointer rounded-md px-3 py-2 text-xs font-semibold transition-colors ${selectedWeekOffset === 0 ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
                Current week
            </button>
            <button
                type="button"
                onClick={() => onWeekChange(1)}
                className={`cursor-pointer rounded-md px-3 py-2 text-xs font-semibold transition-colors ${selectedWeekOffset === 1 ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
                Next week
            </button>
        </div>
    );
});

WeekSelector.displayName = 'WeekSelector';

export default WeekSelector;
