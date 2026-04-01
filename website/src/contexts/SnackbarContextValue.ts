import { createContext } from 'react';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarContextType {
    snackbar: {
        message: string;
        type: SnackbarType;
        show: boolean;
    };
    showSnackbar: (message: string, type?: SnackbarType) => void;
    hideSnackbar: () => void;
}

export const SnackbarContext = createContext<SnackbarContextType | null>(null);