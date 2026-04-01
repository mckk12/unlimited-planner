import { useEffect, useMemo, useState, type FC } from 'react';
import { CreatePlannerModal, PlannerCard, PlannersHeader } from '../components/planners';
import { useAuth } from '../hooks/useAuth';
import { plannersService } from '../services/supabaseClient';
import { useActiveCinemas } from '../hooks/useCinemaData';
import { useCreatePlanner } from '../hooks/useCreatePlanner';
import { formatAvailabilityHour } from '../utils/availability';
import type { Planner } from '../utils/types';
import { useSnackbar } from '../hooks/useSnackbar';

const PlannersLobby: FC = () => {
    const { user } = useAuth();
    const [planners, setPlanners] = useState<Planner[]>([]);
    const [loadingPlanners, setLoadingPlanners] = useState(true);

    const { showSnackbar } = useSnackbar();
    const { cinemas, loading: cinemasLoading } = useActiveCinemas();

    useEffect(() => {
        const fetchPlanners = async () => {
            setLoadingPlanners(true);

            try {
                if (user) {
                    const data = await plannersService.getPlannersByUserId(user.id);
                    setPlanners(data || []);
                } else {
                    setPlanners([]);
                }
            } finally {
                setLoadingPlanners(false);
            }
        };

        fetchPlanners();
    }, [user]);

    const [searchQuery, setSearchQuery] = useState('');

    const cinemaNamesById = useMemo(() => {
        return new Map(cinemas.map(cinema => [Number(cinema.id), cinema.displayName]));
    }, [cinemas]);

    const filteredPlanners = useMemo(() => {
        if (!searchQuery.trim()) return planners;

        const query = searchQuery.trim().toLowerCase();
        return planners.filter(planner =>
            planner.name.toLowerCase().includes(query) ||
            (cinemaNamesById.get(Number(planner.cinema_id)) || '').toLowerCase().includes(query)
        );
    }, [cinemaNamesById, planners, searchQuery]);

    const {
        plannerModalOpen,
        isCreatingPlanner,
        values: createPlannerData,
        errors: errorTextFields,
        openPlannerModal,
        closePlannerModal,
        onNameChange,
        onCinemaChange,
        onStartHourChange,
        onEndHourChange,
        handleCreatePlanner,
    } = useCreatePlanner({
        userId: user?.id,
        showSnackbar,
        onPlannerCreated: (planner) => setPlanners(prev => [planner, ...prev]),
    });

    const getCinemaName = (cinemaId: string) => {
        return cinemaNamesById.get(Number(cinemaId)) || `Cinema #${cinemaId}`;
    };

    return (
        <div className="flex-1 bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <PlannersHeader
                    isAuthenticated={Boolean(user)}
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                    onCreatePlanner={openPlannerModal}
                />

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {loadingPlanners ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="min-h-56 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/70 p-6"
                            />
                        ))
                    ) : filteredPlanners.length > 0 ? (
                        filteredPlanners.map(planner => (
                            <PlannerCard
                                key={planner.id}
                                planner={planner}
                                cinemaName={getCinemaName(planner.cinema_id)}
                                formatHour={formatAvailabilityHour}
                            />
                        ))
                    ) : (
                        <div className="col-span-full rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-16 text-center">
                            <h2 className="text-xl font-semibold text-white">
                                {searchQuery.trim() ? 'No planners match this search' : user ? 'You have no planners yet' : 'No planners available'}
                            </h2>
                            <p className="mt-3 text-sm text-slate-400">
                                {searchQuery.trim()
                                    ? 'Try a different planner name or cinema.'
                                    : user
                                        ? 'Create your first planner to start coordinating with other users.'
                                        : 'Check back later or log in to see your own planners.'}
                            </p>
                        </div>
                    )}
                </section>
            </div>

            <CreatePlannerModal
                cinemas={cinemas}
                cinemasLoading={cinemasLoading}
                errors={errorTextFields}
                isCreatingPlanner={isCreatingPlanner}
                isOpen={plannerModalOpen}
                onCinemaChange={onCinemaChange}
                onClose={closePlannerModal}
                onEndHourChange={onEndHourChange}
                onNameChange={onNameChange}
                onStartHourChange={onStartHourChange}
                onSubmit={handleCreatePlanner}
                values={createPlannerData}
            />
        </div>
    );
};

export default PlannersLobby;