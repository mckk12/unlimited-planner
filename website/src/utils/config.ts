const variables = import.meta.env;

export const config = {
    SUPABASE_URL: variables.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: variables.VITE_SUPABASE_ANON_KEY,
    CINEMACITY_API_BASE_URL: variables.VITE_CINEMACITY_API_BASE_URL || "/api/cinema-city",
};

/**
 * Validates that all required environment variables are set.
 * Throws an error if any required variables are missing.
 */
export const validateConfig = (): void => {
    const requiredVars: Array<[string, string | undefined]> = [
        ['VITE_SUPABASE_URL', config.SUPABASE_URL],
        ['VITE_SUPABASE_ANON_KEY', config.SUPABASE_ANON_KEY],
    ];

    const missing = requiredVars
        .filter(([, value]) => !value)
        .map(([key]) => key);

    if (missing.length > 0) {
        const errorMessage = `Missing required environment variables: ${missing.join(', ')}.\n\nPlease check your .env file and ensure all required variables are set.`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export default config;