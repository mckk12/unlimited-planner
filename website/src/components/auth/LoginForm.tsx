import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { AuthActionError, RegisterDataType } from '../../utils/types';
import { validateLoginForm, validateRegisterForm } from '../../utils/validation';

type LoginFormProps = {
    redirectTo?: string;
};

const getAuthErrorMessage = (error: AuthActionError | undefined, fallback: string) => {
    if (typeof error === 'string' && error.trim()) {
        return error;
    }

    if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as { message?: unknown }).message;
        if (typeof message === 'string' && message.trim()) {
            return message;
        }
    }

    return fallback;
};

const LoginForm: FC<LoginFormProps> = ({ redirectTo = '/' }) => {
    const { login, register, loading } = useAuth();
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState<string>('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        ccnumber: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error when user starts typing
    };

    const validateForm = (): boolean => {
        let validation;
        
        if (isRegister) {
            validation = validateRegisterForm(
                formData.email,
                formData.password,
                formData.confirmPassword,
                formData.username
            );
        } else {
            validation = validateLoginForm(formData.email, formData.password);
        }

        if (!validation.valid) {
            setError(validation.error || 'Validation failed');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            if (isRegister) {
                const registerData: RegisterDataType = {
                    email: formData.email,
                    password: formData.password,
                    username: formData.username,
                    ccnumber: formData.ccnumber || null,
                };
                const result = await register(registerData);
                if (!result.success) {
                    setError(getAuthErrorMessage(result.error, 'Registration failed'));
                    return;
                }
                navigate(redirectTo, { replace: true });
            } else {
                const result = await login(formData.email, formData.password);
                if (!result.success) {
                    setError(getAuthErrorMessage(result.error, 'Login failed'));
                    return;
                }
                navigate(redirectTo, { replace: true });
            }
        } catch (err) {
            setError('An unexpected error occurred: ' + (err instanceof Error ? err.message : String(err)));
        }
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setError('');
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            username: '',
            ccnumber: '',
        });
    };

    return (
        <div className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-center text-2xl font-semibold text-slate-800!">
                {isRegister ? 'Create Account' : 'Login'}
            </h2>

            {error && (
                <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                

                {isRegister && (
                    <div className="space-y-1">
                        <label htmlFor="username" className="text-sm font-medium text-slate-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Choose a username"
                            disabled={loading}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                    </div>
                )}

                <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        disabled={loading}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="password" className="text-sm font-medium text-slate-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        disabled={loading}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                </div>

                {isRegister && (
                    <div className="space-y-1">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your password"
                            disabled={loading}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                    </div>
                )}

                {isRegister && (
                    <div className="space-y-1">
                        <label htmlFor="ccnumber" className="text-sm font-medium text-slate-700">
                            Unlimited Card Number (Optional)
                        </label>
                        <input
                            type="text"
                            id="ccnumber"
                            name="ccnumber"
                            value={formData.ccnumber}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                    {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
                </button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-600">
                <p>
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        type="button"
                        onClick={toggleMode}
                        disabled={loading}
                        className="font-semibold text-slate-900 underline-offset-4 hover:underline disabled:text-slate-400"
                    >
                        {isRegister ? 'Login' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
