import { useState, type ReactNode } from 'react';
import SnackBar from '../components/SnackBar';
import { SnackbarContext, type SnackbarContextType, type SnackbarType } from './SnackbarContextValue';

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [snackbar, setSnackbar] = useState<SnackbarContextType['snackbar']>({
        message: '',
        type: 'info',
        show: false,
    });

    const showSnackbar = (message: string, type: SnackbarType = 'info') => {
        setSnackbar({ message, type, show: true });
    };

    const hideSnackbar = () => {
        setSnackbar(prev => ({ ...prev, show: false }));
    };

    return (
        <SnackbarContext.Provider value={{ snackbar, showSnackbar, hideSnackbar }}>
            {children}
            {snackbar.show && (
                <SnackBar
                    message={snackbar.message}
                    type={snackbar.type}
                    onClose={hideSnackbar}
                />
            )}
        </SnackbarContext.Provider>
    );
};