import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const Login: FC = () => {
    const location = useLocation();
    const fromPath = (location.state as { from?: Location })?.from?.pathname ?? '/';
    return (
        <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <LoginForm redirectTo={fromPath} />
        </div>
    )
};

export default Login;