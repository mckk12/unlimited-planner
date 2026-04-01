import { useEffect, useState } from "react";
import { plannersService } from "../services/supabaseClient";
import { type PlannerDetails } from "../utils/types";

export const usePlannerDetails = (plannerId?: string) => {
    const [plannerDetails, setPlannerDetails] = useState<PlannerDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPlannerDetails = async () => {
            if (!plannerId) {
                setPlannerDetails(null);
                setError(null);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const details = await plannersService.getPlannerById(plannerId);
                if (!isMounted) {
                    return;
                }
                setPlannerDetails(details);
                setError(null);
            } catch (error) {
                console.error("Error fetching planner details:", error);
                if (isMounted) {
                    setError("Planner not found");
                    setPlannerDetails(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPlannerDetails();

        return () => {
            isMounted = false;
        };
    }, [plannerId]);

    return { plannerDetails, setPlannerDetails, loading, error };
};
