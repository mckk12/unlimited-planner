import { useCallback, useRef, useState, type FC, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { type CalendarHandle } from "../components/planner/CalendarComponents/types";
import {
    DeletePlannerModal,
    PlannerCalendarPanel,
    PlannerHeader,
    PlannerMoviesSection,
    PlannerParticipantsSection,
    JoinPlannerModal,
} from "../components/planner";
import { useNowPlayedMovies } from "../hooks/useCinemaData";
import { usePlannerCalendarData } from "../hooks/usePlannerCalendarData";
import { usePlannerDetails } from "../hooks/usePlannerDetails";
import { useSnackbar } from "../hooks/useSnackbar";
import { useAuth } from "../hooks/useAuth";
import { plannersService } from "../services/supabaseClient";
import { copyTextToClipboard } from "../utils/clipboard";
import { startOfWeek, toDateKey } from "../utils/dateUtils";

const getWeekDateStrings = (weekStartDate: Date): string[] => {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStartDate);
        date.setDate(weekStartDate.getDate() + i);
        dates.push(toDateKey(date));
    }
    return dates;
};


const Planner: FC = () => {
    const { plannerId } = useParams<{ plannerId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { plannerDetails, setPlannerDetails, loading: isPlannerLoading, error: plannerError } = usePlannerDetails(plannerId);
    const { showSnackbar } = useSnackbar();
    const hasShownErrorRef = useRef(false);

    const calendarRef = useRef<CalendarHandle>(null);
    const [calendarDate, setCalendarDate] = useState<Date>(() => startOfWeek(new Date()));
    const { events } = usePlannerCalendarData({
        plannerDetails,
        calendarDate,
    });
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { movies } = useNowPlayedMovies();

    // Handle planner not found
    useEffect(() => {
        if (plannerError && !hasShownErrorRef.current) {
            hasShownErrorRef.current = true;
            showSnackbar("Planner does not exist", "error");
            navigate("/planners");
        }
    }, [plannerError, navigate, showSnackbar]);

    const addMovieToPlanner = useCallback(async (movieCode: string) => {
        if (!plannerDetails) return;
        const movie = movies.find(m => m.code === movieCode);
        if (!movie) {
            showSnackbar("Movie not found", "error");
            return;
        }
        try {
            await plannersService.addMovieToPlanner(plannerDetails.id, movie.code);
            setPlannerDetails(prev => prev ? {
                ...prev,
                movies: [...prev.movies, {external_movie_id: movie.code, bans: []}],
            } : prev);
            showSnackbar(`Added "${movie.featureTitle}" to planner`, "success");
        } catch (error) {
            console.error("Error adding movie to planner:", error);
            showSnackbar("Failed to add movie to planner", "error");
        }
    }, [plannerDetails, movies, showSnackbar, setPlannerDetails]);

    const removeMovieFromPlanner = useCallback(async (movieCode: string) => {
        if (!plannerDetails) return;
        try {
            await plannersService.removeMovieFromPlanner(plannerDetails.id, movieCode);
            setPlannerDetails(prev => prev ? {
                ...prev,
                movies: prev.movies.filter(m => m.external_movie_id !== movieCode),
            } : prev);
            showSnackbar(`Removed movie from planner`, "success");
        } catch (error) {
            console.error("Error removing movie from planner:", error);
            showSnackbar("Failed to remove movie from planner", "error");
        }
    }, [plannerDetails, showSnackbar, setPlannerDetails]);

    const handleCopyCcNumber = useCallback(async (ccnumber?: string | null) => {
        if (!ccnumber) return;
        const copied = await copyTextToClipboard(ccnumber);
        if (copied) {
            showSnackbar("CinemaCity Card number copied to clipboard", "success");
        } else {
            showSnackbar("Failed to copy CC number", "error");
        }
    }, [showSnackbar]);

    const handleRemoveParticipant = useCallback(async (participantId: string) => {
        if (!plannerDetails) {
            return;
        }

        try {
            await plannersService.removeUserFromPlanner(plannerDetails.id, participantId);
            setPlannerDetails(prev => prev ? {
                ...prev,
                users: prev.users.filter(participant => participant.id !== participantId),
            } : prev);
            showSnackbar("Participant removed", "success");
        } catch (error) {
            console.error("Error removing participant:", error);
            showSnackbar("Failed to remove participant", "error");
        }
    }, [plannerDetails, setPlannerDetails, showSnackbar]);

    const getPlannerShareLink = useCallback(() => {
        const relativePath = `${location.pathname}${location.search}${location.hash}`;
        if (typeof window === "undefined") return relativePath;
        return `${window.location.origin}${relativePath}`;
    }, [location.hash, location.pathname, location.search]);

    const handleCopyPlannerLink = useCallback(async () => {
        const link = getPlannerShareLink();
        if (!link) return;

        const copied = await copyTextToClipboard(link);
        if (copied) {
            showSnackbar("Planner link copied to clipboard", "success");
        } else {
            showSnackbar("Failed to copy planner link", "error");
        }
    }, [getPlannerShareLink, showSnackbar]);

    const handleShareViaMessenger = useCallback(() => {
        const link = getPlannerShareLink();
        if (!link || !plannerDetails?.name) return;

        const encodedLink = encodeURIComponent(link);
        const quote = encodeURIComponent(`Join the planner - ${plannerDetails.name}`);
        const messengerDialogUrl = `https://www.facebook.com/dialog/send?app_id=87741124305&link=${encodedLink}&quote=${quote}&redirect_uri=${encodedLink}`;
        const popup = window.open(messengerDialogUrl, "_blank", "noopener,noreferrer");
        if (popup) return;

        // Popup blocker fallback and better mobile behavior.
        window.location.href = `fb-messenger://share/?link=${encodedLink}`;
    }, [getPlannerShareLink, plannerDetails]);

    const handleDeleteClick = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!plannerDetails || !plannerId) return;

        setIsDeleteModalOpen(false);
        try {
            await plannersService.deletePlanner(plannerId);
            showSnackbar("Planner deleted successfully", "success");
            navigate("/planners");
        } catch (error) {
            console.error("Error deleting planner:", error);
            showSnackbar("Failed to delete planner", "error");
        }
    }, [navigate, plannerDetails, plannerId, showSnackbar]);

    const isHost = user?.id === plannerDetails?.host_id;

    const handleLeaveClick = useCallback(async () => {
        if (!plannerDetails || !user?.id) return;

        try {
            await plannersService.removeUserFromPlanner(plannerDetails.id, user.id);
            showSnackbar("You left the planner", "success");
            navigate("/planners");
        } catch (error) {
            console.error("Error leaving planner:", error);
            showSnackbar("Failed to leave planner", "error");
        }
    }, [plannerDetails, user, navigate, showSnackbar]);

    const handleJoinPlanner = useCallback(async () => {
        if (!plannerDetails || !user) return;
        try {
            await plannersService.addUserToPlanner(plannerDetails.id, user.id);
            setPlannerDetails(prev => {
                if (!prev) return prev;
                const template = prev.users[0];
                const newUser = {
                    ...template,
                    id: user.id,
                    email: user.email,
                    username: user.user_metadata?.username ?? user.email ?? "",
                };
                return {
                    ...prev,
                    users: [...prev.users, newUser],
                };
            });
            showSnackbar("You have joined the planner!", "success");
        } catch (error) {
            console.error("Error joining planner:", error);
            showSnackbar("Failed to join planner", "error");
        }
    }, [plannerDetails, user, setPlannerDetails, showSnackbar]);

    const toggleMovieBan = useCallback(async (movieCode: string) => {
        if (!plannerDetails || !user?.id) return;
        try {
            await plannersService.toggleMovieBanStatus(plannerDetails.id, movieCode, user.id);
            setPlannerDetails(prev => {
                if (!prev) return prev;
                const movies = prev.movies.map(m => {
                    if (m.external_movie_id === movieCode) {
                        const isBanned = m.bans.includes(user.id);
                        return {
                            ...m,
                            bans: isBanned ? m.bans.filter(id => id !== user.id) : [...m.bans, user.id],
                        };
                    }
                    return m;
                });
                return {
                    ...prev,
                    movies,
                };
            });
            const wasBanned = plannerDetails.movies.find(m => m.external_movie_id === movieCode)?.bans.includes(user.id);
            showSnackbar(wasBanned ? "Movie unbanned" : "Movie banned", "success");
        } catch (error) {
            console.error("Error toggling movie ban status:", error);
            showSnackbar("Failed to update movie ban status", "error");
        }
    }, [plannerDetails, user, setPlannerDetails, showSnackbar]);



    return (
        <div className="mx-auto max-w-450 px-4 py-3 lg:px-8">
            <PlannerHeader
                plannerName={plannerDetails?.name}
                canDeletePlanner={isHost}
                onCopyPlannerLink={() => { void handleCopyPlannerLink(); }}
                onShareViaMessenger={handleShareViaMessenger}
                onDeleteClick={handleDeleteClick}
                onLeaveClick={() => { void handleLeaveClick(); }}
            />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
                <main className="order-2 xl:order-1">
                    <PlannerCalendarPanel
                        calendarRef={calendarRef}
                        startHour={plannerDetails?.start_hour}
                        endHour={plannerDetails?.end_hour}
                        events={events}
                        isLoading={isPlannerLoading}
                        onDateChange={setCalendarDate}
                    />
                </main>

                <aside className="order-1 h-fit rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-[0_20px_50px_rgba(2,6,23,0.35)] xl:order-2">
                    <PlannerMoviesSection
                        movies={movies}
                        plannerMovies={plannerDetails?.movies ?? []}
                        onToggleBanMovie={movieCode => {void toggleMovieBan(movieCode)}}
                        onAddMovie={movieCode => { void addMovieToPlanner(movieCode); }}
                        onRemoveMovie={movieCode => { void removeMovieFromPlanner(movieCode); }}
                    />

                    <PlannerParticipantsSection
                        participants={plannerDetails?.users ?? []}
                        canManageParticipants={isHost}
                        currentUserId={user?.id}
                        onCopyCcNumber={ccnumber => { void handleCopyCcNumber(ccnumber); }}
                        onRemoveParticipant={participantId => { void handleRemoveParticipant(participantId); }}
                        currentWeekDates={getWeekDateStrings(calendarDate)}
                    />
                </aside>
            </div>

            <DeletePlannerModal
                isOpen={isDeleteModalOpen}
                plannerName={plannerDetails?.name}
                onConfirmDelete={() => { void handleConfirmDelete(); }}
                onClose={() => { setIsDeleteModalOpen(false); }}
            />

            <JoinPlannerModal
                isOpen={plannerDetails && user ? !plannerDetails.users.some(u => u.id === user.id) : false}
                onJoin={() => { void handleJoinPlanner(); }}
                onClose={() => {}}
            />
        </div>
    );
};

export default Planner;