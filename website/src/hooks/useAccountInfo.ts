import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { validateEmail, validateUsername } from '../utils/validation';
import type { User } from "@supabase/auth-js";

interface UserData {
    email: string;
    username: string;
    ccnumber: string;
}

export const useAccountInfo = (user: User | null) => {
    const [userData, setUserData] = useState<UserData>({
        email: user?.email || '',
        username: user?.user_metadata?.username || '',
        ccnumber: user?.user_metadata?.ccnumber || '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUserData({
                email: user.email || '',
                username: user.user_metadata?.username || '',
                ccnumber: user.user_metadata?.ccnumber || '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        if (user) {
            setUserData({
                email: user.email || '',
                username: user.user_metadata?.username || '',
                ccnumber: user.user_metadata?.ccnumber || '',
            });
        }
        setIsEditing(false);
    };

    const handleSave = async (): Promise<{ success: boolean; error?: string }> => {
        setLoading(true);

        // Validate email
        const emailValidation = validateEmail(userData.email);
        if (!emailValidation.valid) {
            setLoading(false);
            return { success: false, error: emailValidation.error || 'Invalid email' };
        }

        // Validate username
        const usernameValidation = validateUsername(userData.username);
        if (!usernameValidation.valid) {
            setLoading(false);
            return { success: false, error: usernameValidation.error || 'Invalid username' };
        }

        try {
            const result = await supabase.auth.updateUser({
                email: userData.email,
                data: {
                    username: userData.username,
                    ccnumber: userData.ccnumber || null,
                }
            });
            
            if (result.error) {
                return { 
                    success: false, 
                    error: result.error.message || 'Failed to update user info' 
                };
            }

            setIsEditing(false);
            return { success: true };
            
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : undefined;
            return { 
                success: false, 
                error: message || 'Failed to update user info' 
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        userData,
        isEditing,
        loading,
        setIsEditing,
        handleChange,
        handleCancel,
        handleSave,
    };
};
