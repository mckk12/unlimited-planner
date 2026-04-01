import { memo, type FC } from "react";
import Modal from "../Modal";

interface JoinPlannerModalProps {
    isOpen: boolean;
    onJoin: () => void;
    onClose: () => void;
}

const JoinPlannerModal: FC<JoinPlannerModalProps> = ({ isOpen, onJoin, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Join Planner?</h2>
                <p className="text-gray-700 dark:text-gray-300">You are not a participant in this planner. Would you like to join?</p>
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                        onClick={onJoin}
                    >
                        Join
                    </button>
                    <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default memo(JoinPlannerModal);
