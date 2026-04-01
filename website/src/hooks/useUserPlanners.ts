import { useEffect, useState } from 'react';
import { plannersService } from '../services/supabaseClient';
import type { Planner } from '../utils/types';

export const useUserPlanners = (userId?: string) => {
    const [planners, setPlanners] = useState<Planner[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            return;
        }

        let cancelled = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        setError(null);

        plannersService.getPlannersByUserId(userId)
            .then((data) => {
                if (cancelled) {
                    return;
                }

                setPlanners((data || []) as Planner[]);
            })
            .catch((err: unknown) => {
                if (cancelled) {
                    return;
                }

                const message = err instanceof Error && err.message
                    ? err.message
                    : 'Could not load your planners';
                setError(message);
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [userId]);

    return {
        planners,
        loading,
        error,
    };
};
