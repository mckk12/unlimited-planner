import type { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useSnackbar } from '../../hooks/useSnackbar';
import type { Planner } from '../../utils/types';
import { copyTextToClipboard } from '../../utils/clipboard';

interface PlannerCardProps {
    planner: Planner;
    cinemaName: string;
    formatHour: (hour: number) => string;
}

const PlannerCard: FC<PlannerCardProps> = ({ planner, cinemaName, formatHour }) => {
    const { showSnackbar } = useSnackbar();

    const handleShare = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const plannerUrl = `${window.location.origin}/planner/${planner.id}`;

        const copied = await copyTextToClipboard(plannerUrl);
        if (copied) {
            showSnackbar('Planner link copied to clipboard', 'success');
        } else {
            showSnackbar('Failed to copy planner link', 'error');
        }
    };

    return (
        <Link
            to={`/planner/${planner.id}`}
            className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-6 no-underline! transition hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-cyan-950/30"
        >
            <div className="flex h-full flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-white transition group-hover:text-cyan-200">
                            {planner.name}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={handleShare}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-500/50 hover:text-cyan-200"
                        aria-label="Share planner"
                    >
                        <FontAwesomeIcon icon={faShareNodes} className="text-sm" />
                        Share
                    </button>
                </div>

                <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Cinema</p>
                        <p className="mt-2 text-base font-semibold text-slate-100">{cinemaName}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Hours</p>
                        <p className="mt-2 text-base font-semibold text-slate-100">
                            {formatHour(planner.start_hour)} - {formatHour(planner.end_hour)}
                        </p>
                    </div>
                </div>

                <p className="mt-auto text-sm font-medium text-cyan-300 transition group-hover:text-cyan-200">
                    Open planner details
                </p>
            </div>
        </Link>
    );
};

export default PlannerCard;