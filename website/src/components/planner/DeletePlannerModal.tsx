import { memo, type FC } from "react";
import Modal from "../Modal";

type DeletePlannerModalProps = {
    isOpen: boolean;
    plannerName?: string;
    onConfirmDelete: () => void;
    onClose: () => void;
};

const DeletePlannerModal: FC<DeletePlannerModalProps> = ({
    isOpen,
    plannerName,
    onConfirmDelete,
    onClose,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete Planner</h2>
                <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete <span className="font-semibold">"{plannerName}"</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onConfirmDelete}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500"
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default memo(DeletePlannerModal);