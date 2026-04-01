import config from "../utils/config";
import { createClient } from "@supabase/supabase-js";
import type { AvailabilityPayload } from "../utils/types";

export const supabase = createClient(config.SUPABASE_URL!, config.SUPABASE_ANON_KEY!);

const getUserAvailabilityPerDay = async (userId: string, date: string) => {
    const { data, error } = await supabase.from("users_availability").select(`
        user:user_id (id, username, ccnumber),
        date,
        availability
        `).eq("user_id", userId).eq("date", date).maybeSingle();
    if (error) {
        console.error("Error fetching user availability:", error);
        throw error;
    }
    return data;
};

const getUserAvailabilities = async (userId: string, dates: string[]) => {
        const { data, error } = await supabase.from("users_availability").select(`
        date,
        availability
        `).eq("user_id", userId).in("date", dates);
    if (error) {
        console.error("Error fetching availability for users on days:", error);
        throw error;
    }
    return data;
}

const setUserAvailability = async (userId: string, date: string, availability: AvailabilityPayload) => {
    const { data, error } = await supabase.from("users_availability").upsert(
        { user_id: userId, date, availability },
        { onConflict: "user_id,date" },
    ).select("*").single();
    if (error) {
        console.error("Error setting user availability:", error);
        throw error;
    }
    return data;
};

const getAvailabilityForUsersOnDays = async (userIds: string[], dates: string[]) => {
    const { data, error } = await supabase.from("users_availability").select(`
        user:user_id (id, username, ccnumber),
        date,
        availability
        `).in("user_id", userIds).in("date", dates);
    if (error) {
        console.error("Error fetching availability for users on days:", error);
        throw error;
    }
    return data;
};

export const availabilityService = {
    getUserAvailabilityPerDay,
    setUserAvailability,
    getAvailabilityForUsersOnDays,
    getUserAvailabilities
};

const getSomePlanners = async () => {
    const { data, error } = await supabase.from("meetings").select("*").order("created_at", { ascending: false }).limit(20);
    if (error) {
        console.error("Error fetching planners:", error);
        throw error;
    }
    return data;
};

const getPlannerById = async (plannerId: string) => {
    const { data, error } = await supabase.from("meetings").select(`
        *,
        users:meeting_users (
            users (id, username, ccnumber)
        ),
        movies:movies_added (external_movie_id, bans)
    `).eq("id", plannerId).single();
    if (error) {
        console.error("Error fetching planner by ID:", error);
        throw error;
    }

    const users = Array.isArray(data?.users) ? data.users.map((u: { users: unknown }) => u.users) : [];
    const movies = Array.isArray(data?.movies) ? data.movies.map((m: { external_movie_id: string, bans: string[] }) => ({
        external_movie_id: m.external_movie_id,
        bans: m.bans || [],
    })) : [];

    return {
        ...data,
        users,
        movies,
    };
};

const getPlannersByUserId = async (userId: string) => {
    const { data, error } = await supabase
        .from('meetings')
        .select(`
            *,
            meeting_users!inner()
        `)
        .eq('meeting_users.user_id', userId);
    if (error) {
        console.error("Error fetching planners by user ID:", error);
        throw error;
    }
    return data;
};

const createPlanner = async (name: string, cinema_id: number, start_hour: number, end_hour: number, host_id: string) => {
    const { data, error } = await supabase.from("meetings").insert({ name, cinema_id, start_hour, end_hour, host_id }).select("*").single();
    if (error) {
        console.error("Error creating planner:", error);
        throw error;
    }
    return data;
};

const addMovieToPlanner = async (plannerId: string, externalMovieId: string) => {
    const { data, error } = await supabase.from("movies_added").insert({ meeting_id: plannerId, external_movie_id: externalMovieId }).select("*").single();
    if (error) {
        console.error("Error adding movie to planner:", error);
        throw error;
    }
    return data;
};

const removeMovieFromPlanner = async (plannerId: string, externalMovieId: string) => {
    const { data, error } = await supabase.from("movies_added").delete().eq("meeting_id", plannerId).eq("external_movie_id", externalMovieId).select("*").single();
    if (error) {
        console.error("Error removing movie from planner:", error);
        throw error;
    }
    return data;
};

const deletePlanner = async (plannerId: string) => {
    const { data, error } = await supabase.from("meetings").delete().eq("id", plannerId).select("*").single();
    if (error) {
        console.error("Error deleting planner:", error);
        throw error;
    }
    return data;
};

const addUserToPlanner = async (plannerId: string, userId: string) => {
    const { data, error } = await supabase.from("meeting_users").insert({ meeting_id: plannerId, user_id: userId }).select("*").single();
    if (error) {
        console.error("Error adding user to planner:", error);
        throw error;
    }
    return data;
};

const removeUserFromPlanner = async (plannerId: string, userId: string) => {
    const { data, error } = await supabase.from("meeting_users").delete().eq("meeting_id", plannerId).eq("user_id", userId).select("*").single();
    if (error) {
        console.error("Error removing user from planner:", error);
        throw error;
    }
    return data;
}

export const toggleMovieBanStatus = async (plannerId: string, externalMovieId: string, userId: string) => {
    const { error } = await supabase.rpc("toggle_movie_ban", {
        p_meeting_id: plannerId,
        p_movie_id: externalMovieId,
        p_user_id: userId
    });

    if (error) {
        throw error;
    }

    return true;
}


export const plannersService = {
    getSomePlanners,
    getPlannerById,
    createPlanner,
    getPlannersByUserId,
    addMovieToPlanner,
    removeMovieFromPlanner,
    deletePlanner,
    addUserToPlanner,
    removeUserFromPlanner,
    toggleMovieBanStatus,
};

const getUserById = async (userId: string) => {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();
    if (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
    return data;
};

export const usersService = {
    getUserById,
};