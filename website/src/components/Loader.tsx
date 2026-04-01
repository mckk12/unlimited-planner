import type { FC } from 'react';

type LoaderProps = {
	label?: string;
	fullScreen?: boolean;
};

const Loader: FC<LoaderProps> = ({ label = 'Loading...', fullScreen = true }) => {
	return (
		<div className={fullScreen ? 'flex min-h-[60vh] items-center justify-center' : 'flex items-center justify-center py-8'}>
			<div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 px-6 py-5 shadow-[0_20px_50px_rgba(2,6,23,0.35)]">
				<div className="flex items-center gap-3">
					<span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-500 border-t-cyan-400" aria-hidden="true" />
					<span className="text-sm font-medium text-slate-200">{label}</span>
				</div>
			</div>
		</div>
	);
};

export default Loader;
