import { memo, type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faTrash, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";

type PlannerHeaderProps = {
    plannerName?: string;
    canDeletePlanner: boolean;
    onCopyPlannerLink: () => void;
    onShareViaMessenger: () => void;
    onDeleteClick: () => void;
    onLeaveClick: () => void;
};

const PlannerHeader: FC<PlannerHeaderProps> = ({
    plannerName,
    canDeletePlanner,
    onCopyPlannerLink,
    onShareViaMessenger,
    onDeleteClick,
    onLeaveClick,
}) => {
    return (
        <header className="mb-6 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-[0_20px_50px_rgba(2,6,23,0.45)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-100">{plannerName ?? "Planner"}</h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Build your perfect cinema week by adding movies and coordinating availability with participants.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                    <button
                        type="button"
                        onClick={onCopyPlannerLink}
                        title="Copy planner link to clipboard"
                        className="cursor-pointer inline-flex items-center gap-2 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 transition-colors hover:border-cyan-400 hover:text-cyan-300"
                    >
                        <FontAwesomeIcon icon={faLink} className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={onShareViaMessenger}
                        title="Share planner link via Facebook Messenger"
                        className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-500"
                    >
                        <FontAwesomeIcon icon={faFacebookMessenger} className="h-4 w-4" />
                    </button>
                    {canDeletePlanner && (
                        <button
                            type="button"
                            onClick={onDeleteClick}
                            title="Delete this planner"
                            className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500"
                        >
                            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onLeaveClick}
                        title="Leave this planner"
                        className="cursor-pointer inline-flex items-center gap-2 rounded-md border border-orange-600 bg-orange-600/10 px-3 py-2 text-sm font-semibold text-orange-400 transition-colors hover:bg-orange-600 hover:text-white"
                    >
                        <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default memo(PlannerHeader);