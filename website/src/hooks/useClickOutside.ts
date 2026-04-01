import { useEffect } from 'react';

type MaybeRefObject<T extends HTMLElement> = {
    current: T | null;
};

export const useClickOutside = <T extends HTMLElement>(
    ref: MaybeRefObject<T>,
    onOutsideClick: () => void,
    enabled: boolean = true,
) => {
    useEffect(() => {
        if (!enabled) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node | null;
            if (ref.current && target && !ref.current.contains(target)) {
                onOutsideClick();
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [enabled, onOutsideClick, ref]);
};
