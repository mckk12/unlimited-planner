import type {FC, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 bg-white! dark:bg-gray-800! rounded-lg shadow-lg p-6 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 text-gray-800 dark:text-gray-200">{children}</div>
        <button
          className="absolute top-2 right-2 text-2xl! text-gray-400! hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus:outline-none cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Modal;
