import { useState } from 'react';
import { plannersService } from '../services/supabaseClient';
import type { Planner } from '../utils/types';

type CreatePlannerData = {
    name: string;
    cinema_id: string;
    start_hour: number;
    end_hour: number;
};

type CreatePlannerErrors = {
    name: boolean;
    cinema_id: boolean;
    hours: boolean;
};

type UseCreatePlannerParams = {
    userId?: string;
    showSnackbar: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
    onPlannerCreated: (planner: Planner) => void;
};

const DEFAULT_CREATE_PLANNER_DATA: CreatePlannerData = {
    name: '',
    cinema_id: '',
    start_hour: 10,
    end_hour: 20,
};

const DEFAULT_CREATE_PLANNER_ERRORS: CreatePlannerErrors = {
    name: false,
    cinema_id: false,
    hours: false,
};

export const useCreatePlanner = ({ userId, showSnackbar, onPlannerCreated }: UseCreatePlannerParams) => {
    const [isCreatingPlanner, setIsCreatingPlanner] = useState(false);
    const [plannerModalOpen, setPlannerModalOpen] = useState(false);
    const [values, setValues] = useState<CreatePlannerData>(DEFAULT_CREATE_PLANNER_DATA);
    const [errors, setErrors] = useState<CreatePlannerErrors>(DEFAULT_CREATE_PLANNER_ERRORS);

    const openPlannerModal = () => {
        if (!userId) {
            showSnackbar('You need to be logged in to create a planner', 'error');
            return;
        }
        setPlannerModalOpen(true);
    };

    const closePlannerModal = () => {
        setPlannerModalOpen(false);
        setErrors(DEFAULT_CREATE_PLANNER_ERRORS);
    };

    const onNameChange = (value: string) => {
        setValues(prev => ({ ...prev, name: value }));
        setErrors(prev => ({ ...prev, name: false }));
    };

    const onCinemaChange = (value: string) => {
        setValues(prev => ({ ...prev, cinema_id: value }));
        setErrors(prev => ({ ...prev, cinema_id: false }));
    };

    const onStartHourChange = (value: number) => {
        setValues(prev => ({ ...prev, start_hour: value }));
        setErrors(prev => ({ ...prev, hours: false }));
    };

    const onEndHourChange = (value: number) => {
        setValues(prev => ({ ...prev, end_hour: value }));
        setErrors(prev => ({ ...prev, hours: false }));
    };

    const handleCreatePlanner = async () => {
        const { name, cinema_id, start_hour, end_hour } = values;
        const parsedCinemaId = Number(cinema_id);

        if (!name.trim()) {
            setErrors(prev => ({ ...prev, name: true }));
            return;
        }

        if (!cinema_id) {
            setErrors(prev => ({ ...prev, cinema_id: true }));
            return;
        }

        if (start_hour >= end_hour) {
            setErrors(prev => ({ ...prev, hours: true }));
            return;
        }

        if (!userId) {
            showSnackbar('You need to be logged in to create a planner', 'error');
            return;
        }

        try {
            setIsCreatingPlanner(true);
            const newPlanner = await plannersService.createPlanner(name.trim(), parsedCinemaId, start_hour, end_hour, userId);
            onPlannerCreated(newPlanner);
            closePlannerModal();
            setValues(DEFAULT_CREATE_PLANNER_DATA);
            showSnackbar('Planner created successfully', 'success');
        } catch {
            showSnackbar('Error creating planner', 'error');
        } finally {
            setIsCreatingPlanner(false);
        }
    };

    return {
        plannerModalOpen,
        isCreatingPlanner,
        values,
        errors,
        openPlannerModal,
        closePlannerModal,
        onNameChange,
        onCinemaChange,
        onStartHourChange,
        onEndHourChange,
        handleCreatePlanner,
    };
};
