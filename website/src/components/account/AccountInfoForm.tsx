import { type FC, type ChangeEvent } from "react";

interface UserData {
    email: string;
    username: string;
    ccnumber: string;
}

interface AccountInfoFormProps {
    userData: UserData;
    isEditing: boolean;
    loading: boolean;
    onEditToggle: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
}

const AccountInfoForm: FC<AccountInfoFormProps> = ({
    userData,
    isEditing,
    loading,
    onEditToggle,
    onChange,
    onSave,
}) => {
    return (
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-100!">Account Information</h2>
                <div className="flex gap-2">
                    {isEditing && (
                        <button
                            onClick={onSave}
                            disabled={loading}
                            className="cursor-pointer px-4 py-2 rounded-lg! bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white font-medium transition-colors"
                        >
                            Save
                        </button>
                    )}
                    <button
                        onClick={onEditToggle}
                        className="cursor-pointer px-4 py-2 rounded-lg! bg-cyan-400 text-slate-900 hover:bg-cyan-300 transition-colors font-medium"
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                </div>
            </div>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={onChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={onChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Unlimited Card Number</label>
                    <input
                        type="text"
                        name="ccnumber"
                        value={userData.ccnumber}
                        onChange={onChange}
                        disabled={!isEditing}
                        placeholder="Enter Unlimited card number"
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                </div>
            </div>
        </div>
    );
};

export default AccountInfoForm;
