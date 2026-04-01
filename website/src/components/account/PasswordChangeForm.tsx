import { type FC, type ChangeEvent } from "react";

interface PasswordData {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface PasswordChangeFormProps {
    passwordData: PasswordData;
    loading: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
}

const PasswordChangeForm: FC<PasswordChangeFormProps> = ({
    passwordData,
    loading,
    onChange,
    onSave,
}) => {
    return (
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-100!">Change Password</h2>
                <div className="flex gap-2">
                    <button
                        onClick={onSave}
                        disabled={loading}
                        className="cursor-pointer px-4 py-2 rounded-lg! bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white font-medium transition-colors"
                    >
                        Update
                    </button>
                </div>
            </div>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Old Password</label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={onChange}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={onChange}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={onChange}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                </div>
            </div>
        </div>
    );
};

export default PasswordChangeForm;
