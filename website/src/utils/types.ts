import type { User as SupabaseUser } from "@supabase/auth-js";
import type { AuthError } from "@supabase/supabase-js";

export interface RegisterDataType {
    email: string;
    password: string;
    username: string;
    ccnumber?: string | null;
}

export type AuthActionError = AuthError | string;

export type AuthActionResult =
    | { success: true }
    | { success: false; error: AuthActionError };

export type AuthContextType = {
    user: SupabaseUser | null;
    register: (registerData : RegisterDataType) => Promise<AuthActionResult>;
    login: (email: string, password: string) => Promise<AuthActionResult>;
    logout: () => Promise<void>;
    loading: boolean;
};

export interface User {
    id: string;
    username: string;
    ccnumber?: string | null;
}

export interface Planner {
    id: string;
    pass: string;
    name: string;
    cinema_id: string;
    host_id: string;
    start_hour: number;
    end_hour: number;
    created_at: string;
}

export interface SupabaseMovie {
    external_movie_id: string;
    bans: string[]; // array of user_ids who banned the movie
}

export interface PlannerDetails extends Planner {
    users: User[];
    movies: SupabaseMovie[];
}

export interface AvailabilityPayload {
    canGo: number[];
    maybe: number[];
};

export interface UserAvailability {
    user: User;
    date: Date;
    availability: AvailabilityPayload;
}

interface CCMovieData {
    id: string;
    length: number;
    link: string;
    name: string;
}

interface CCMovieEventData {
    id: number;
    filmId: string;
    bookingLink: string;
    eventDateTime: Date;
    availabilityRatio: number; // from 0 to 1
    auditiorium: string;
    attributeIds: string[];
}

export interface DataInCinemaAtDateResponse {
    body: {
        films: CCMovieData[],
        events: CCMovieEventData[]
    }
}

export interface MoviePoster {
    code: string;
    attributes: string[];
    featureTitle: string;
    posterSrc: string;
    url: string;
}

export interface AttributeItem {
    id: string;
    url: string | null;
    visible: boolean;
    sequence: number | null;
}

export interface AttributeGroup {
    "group-name": string;
    items: AttributeItem[];
}

export interface CCCinema {
    id: string;
    groupId: string;
    displayName: string;
    link: string;
}

