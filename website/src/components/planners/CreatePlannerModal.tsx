import type { FC } from 'react';
import Modal from '../Modal';
import type { CCCinema } from '../../utils/types';

interface CreatePlannerData {
    name: string;
    cinema_id: string;
    start_hour: number;
    end_hour: number;
}

interface CreatePlannerErrors {
    name: boolean;
    cinema_id: boolean;
    hours: boolean;
}

interface CreatePlannerModalProps {
    cinemas: CCCinema[];
    cinemasLoading: boolean;
    errors: CreatePlannerErrors;
    isCreatingPlanner: boolean;
    isOpen: boolean;
    onCinemaChange: (value: string) => void;
    onClose: () => void;
    onEndHourChange: (value: number) => void;
    onNameChange: (value: string) => void;
    onStartHourChange: (value: number) => void;
    onSubmit: () => void;
    values: CreatePlannerData;
}

const CreatePlannerModal: FC<CreatePlannerModalProps> = ({
    cinemas,
    cinemasLoading,
    errors,
    isCreatingPlanner,
    isOpen,
    onCinemaChange,
    onClose,
    onEndHourChange,
    onNameChange,
    onStartHourChange,
    onSubmit,
    values,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="space-y-5">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create a planner</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Give it a name, pick the cinema and choose time range.
                    </p>
                </div>

                <div className="grid gap-4">
                    <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                        Planner name
                        <input
                            type="text"
                            value={values.name}
                            onChange={(event) => onNameChange(event.target.value)}
                            placeholder="Friday night screening"
                            className={`rounded-xl border px-4 py-3 outline-none transition ${errors.name ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200'} bg-white text-slate-900`}
                        />
                    </label>

                    <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                        Cinema
                        <select
                            value={values.cinema_id}
                            onChange={(event) => onCinemaChange(event.target.value)}
                            disabled={cinemasLoading || cinemas.length === 0}
                            className={`rounded-xl border px-4 py-3 outline-none transition ${errors.cinema_id ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200'} bg-white text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100`}
                        >
                            <option value="">{cinemasLoading ? 'Loading cinemas...' : 'Select a cinema'}</option>
                            {cinemas.map(cinema => (
                                <option key={cinema.id} value={cinema.id}>
                                    {cinema.displayName}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                            Start hour
                            <input
                                type="number"
                                min={0}
                                max={23}
                                value={values.start_hour}
                                onChange={(event) => onStartHourChange(Number(event.target.value))}
                                className={`rounded-xl border px-4 py-3 outline-none transition ${errors.hours ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200'} bg-white text-slate-900`}
                            />
                        </label>

                        <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                            End hour
                            <input
                                type="number"
                                min={0}
                                max={23}
                                value={values.end_hour}
                                onChange={(event) => onEndHourChange(Number(event.target.value))}
                                className={`rounded-xl border px-4 py-3 outline-none transition ${errors.hours ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200'} bg-white text-slate-900`}
                            />
                        </label>
                    </div>

                    {errors.hours && (
                        <p className="text-sm text-red-600">End hour must be later than start hour.</p>
                    )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={isCreatingPlanner}
                        className="cursor-pointer rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-cyan-300"
                    >
                        {isCreatingPlanner ? 'Creating...' : 'Create planner'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CreatePlannerModal;