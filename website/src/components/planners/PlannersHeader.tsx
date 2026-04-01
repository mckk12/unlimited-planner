import type { FC } from 'react';

interface PlannersHeaderProps {
    isAuthenticated: boolean;
    searchQuery: string;
    onSearchQueryChange: (value: string) => void;
    onCreatePlanner: () => void;
}

const PlannersHeader: FC<PlannersHeaderProps> = ({
    isAuthenticated,
    searchQuery,
    onSearchQueryChange,
    onCreatePlanner,
}) => {
    return (
        <section className="rounded-3xl border border-slate-800 bg-linear-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl space-y-3">
                    <span className="inline-flex w-fit rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                        Planners Lobby
                    </span>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                            {isAuthenticated ? 'Your movie meetings planners' : 'Recent public planners'}
                        </h1>
                        <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                            {isAuthenticated
                                ? 'Browse the planners you belong to, filter them quickly, and create a new one when you are planning your next cinema run.'
                                : 'Browse a sample of recent planners. Log in if you want your own list and the ability to create a new planner.'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-300">Search planners</span>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => onSearchQueryChange(event.target.value)}
                            placeholder="Search by planner or cinema name"
                            className="w-full flex-1 rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                        />

                        {isAuthenticated && (
                            <button
                                type="button"
                                onClick={onCreatePlanner}
                                className="cursor-pointer rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold whitespace-nowrap text-slate-950 transition hover:bg-cyan-400"
                            >
                                Create planner
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PlannersHeader;