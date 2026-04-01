import { useState, useEffect, useCallback, type FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface SnackBarProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

const SnackBar: FC<SnackBarProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [isShowing, setIsShowing] = useState(false);
  const [isRendered, setIsRendered] = useState(true);

  const typeStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const handleClose = useCallback(() => {
    setIsShowing(false);
    setTimeout(() => {
      setIsRendered(false);
      onClose?.();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsShowing(true), 50);

    let hideTimer: ReturnType<typeof setTimeout>;
    if (duration > 0) {
      hideTimer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [duration, handleClose]);

  if (!isRendered) return null;

  return (
    <div 
      className={`z-99999 fixed bottom-4 left-4 right-4 md:left-auto md:w-80 rounded-md shadow-lg p-4 ${typeStyles[type]} text-white flex items-center justify-between transition-all duration-300 transform ${
        isShowing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        className="ml-4 text-white hover:opacity-80 transition-opacity shrink-0 flex items-center justify-center p-1"
        onClick={handleClose}
        aria-label="Close snackbar"
      >
        <FontAwesomeIcon icon={faXmark} className="w-5 h-5 cursor-pointer" />
      </button>
    </div>
  );
};

export default SnackBar;
