import React, { useState, useEffect, useRef, DependencyList } from 'react';


export function useIsUnsaved<T>(checkFunction: (check: T) => boolean, deps: T) {
    const isUnsaved = useRef<boolean>(false);
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isUnsaved.current) {
                const message = 'You have unsaved changes. Are you sure you want to leave?';
                event.returnValue = message;
                return message;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isUnsaved]);
    useEffect(() => {
        if (checkFunction(deps)) {
            isUnsaved.current = true;
        }
        else {
            isUnsaved.current = false;
        }
    }, [deps]);
    return isUnsaved;
}