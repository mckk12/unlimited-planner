import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { validatePassword, validatePasswordMatch } from '../utils/validation';


interface PasswordData {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const usePasswordChange = (userEmail?: string) => {
    const [passwordData, setPasswordData] = useState<PasswordData>({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (): Promise<{ success: boolean; error?: string }> => {
        // Validate old password is provided
        if (!passwordData.oldPassword) {
            return { success: false, error: 'Current password is required' };
        }

        // Validate new password
        const passwordValidation = validatePassword(passwordData.newPassword);
        if (!passwordValidation.valid) {
            return { 
                success: false, 
                error: passwordValidation.error || 'Invalid password' 
            };
        }

        // Validate password match
        const passwordMatchValidation = validatePasswordMatch(
            passwordData.newPassword,
            passwordData.confirmPassword
        );
        if (!passwordMatchValidation.valid) {
            return { 
                success: false, 
                error: passwordMatchValidation.error || 'Passwords do not match' 
            };
        }

        setLoading(true);

        try {
            // Verify old password is correct
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: userEmail || '',
                password: passwordData.oldPassword
            });

            if (signInError) {
                setLoading(false);
                return { success: false, error: 'Current password is incorrect' };
            }

            // Update to new password
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });

            if (error) {
                return { 
                    success: false, 
                    error: error.message || 'Failed to update password' 
                };
            }

            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            return { success: true };
            
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : undefined;
            return { 
                success: false, 
                error: message || 'Failed to update password' 
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        passwordData,
        loading,
        handleChange,
        handleSave,
    };
};
