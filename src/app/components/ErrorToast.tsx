'use client';

import { useEffect } from 'react';

import { cn } from '../utils/tailwind';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function ErrorToast({ message, onClose, duration = 3000 }: ErrorToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeout(onClose, 1000);
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={cn(
        'fixed bottom-40 left-5 z-50 flex -translate-x-16 items-center gap-3 rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700 shadow-lg transition-all duration-500 ease-out',
        {
          'translate-x-0': message
        }
      )}
    >
      <span>{message}</span>
    </div>
  );
}
