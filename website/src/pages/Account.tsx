import { type FC, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Modal from "../components/Modal";
import { AccountInfoForm, PasswordChangeForm } from "../components/account";
import { useAccountInfo } from "../hooks/useAccountInfo";
import { usePasswordChange } from "../hooks/usePasswordChange";
import { useSnackbar } from "../hooks/useSnackbar";


const Account: FC = () => {
    const { user, logout } = useAuth();
    const { showSnackbar } = useSnackbar();
    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => Promise<void>;
        isLoading: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: async () => {},
        isLoading: false,
    });
    
    // Account Info Hook
    const {
        userData,
        isEditing,
        loading: infoLoading,
        setIsEditing,
        handleChange: handleInfoChange,
        handleCancel: handleInfoCancel,
        handleSave: saveAccountInfo,
    } = useAccountInfo(user);

    // Password Change Hook
    const {
        passwordData,
        loading: passwordLoading,
        handleChange: handlePasswordChange,
        handleSave: savePassword,
    } = usePasswordChange(user?.email || '');

    const handleInfoSave = () => {
        setConfirmationModal({
            isOpen: true,
            title: 'Confirm Changes',
            message: 'Are you sure you want to save these changes?',
            onConfirm: async () => {
                const result = await saveAccountInfo();
                setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                if (result.success) {
                    showSnackbar('User information updated successfully', 'success');
                } else {
                    showSnackbar(result.error || 'Failed to update user info', 'error');
                }
            },
            isLoading: infoLoading,
        });
    };

    const handlePasswordSave = () => {
        setConfirmationModal({
            isOpen: true,
            title: 'Confirm Password Change',
            message: 'Are you sure you want to change your password?',
            onConfirm: async () => {
                const result = await savePassword();
                setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                if (result.success) {
                    showSnackbar('Password updated successfully', 'success');
                } else {
                    showSnackbar(result.error || 'Failed to update password', 'error');
                }
            },
            isLoading: passwordLoading,
        });
    };


    if (!user) {
        return (
            <div className="h-full bg-slate-950 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-slate-300 text-lg">Please log in to view your account</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-950 flex-1 w-full h-full flex flex-col justify-center py-8">
            <div className="mx-auto w-full max-w-7xl px-4">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                    {/* Account Information Form */}
                    <AccountInfoForm
                        userData={userData}
                        isEditing={isEditing}
                        loading={infoLoading}
                        onEditToggle={() => isEditing ? handleInfoCancel() : setIsEditing(true)}
                        onChange={handleInfoChange}
                        onSave={handleInfoSave}
                    />

                    {/* Password Change Form */}
                    <PasswordChangeForm
                        passwordData={passwordData}
                        loading={passwordLoading}
                        onChange={handlePasswordChange}
                        onSave={handlePasswordSave}
                    />
                </div>

                {/* Logout Button */}
                <div className="flex justify-center">
                    <button
                        onClick={logout}
                        className="cursor-pointer px-8 py-3 rounded-lg! bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal 
                isOpen={confirmationModal.isOpen} 
                onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
            >
                <h2 className="text-xl font-bold mb-4">{confirmationModal.title}</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300!">
                    {confirmationModal.message}
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={confirmationModal.onConfirm}
                        disabled={confirmationModal.isLoading}
                        className="px-4 py-2 rounded-lg! bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white font-medium transition-colors cursor-pointer"
                    >
                        {confirmationModal.isLoading ? 'Processing...' : 'Confirm'}
                    </button>
                    <button
                        onClick={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
                        className="px-4 py-2 rounded-lg! bg-gray-300! hover:bg-gray-400! dark:bg-gray-700! dark:hover:bg-gray-600! text-gray-800! dark:text-gray-200! font-medium transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    
                </div>
            </Modal>
        </div>
    );
}

export default Account;