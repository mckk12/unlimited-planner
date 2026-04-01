import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface NotFoundProps {
    children?: ReactNode;
}

const NotFound: React.FC<NotFoundProps> = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-950 flex-1 w-full h-full flex flex-col items-center justify-center">
            <div className="text-center max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-cyan-400 mb-4">404</h1>
                    <h2 className="text-4xl font-bold text-slate-100 mb-4">Page Not Found</h2>
                    <p className="text-xl text-slate-400 mb-8">
                        The page you are looking for does not exist or has been moved.
                    </p>
                </div>
                
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 rounded-lg bg-cyan-400 text-slate-900 hover:bg-cyan-300 font-medium transition-colors"
                    >
                        Go Home
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-lg bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700 font-medium transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;