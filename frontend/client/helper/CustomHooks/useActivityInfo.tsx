import React, { useState, useEffect } from 'react';
import { getAuthenticatedUser } from '../user';
import { NavigateFunction } from 'react-router-dom';
import { handleGetActivity } from '../userRequestHandler';
import { Activity } from '../../../shared/data';

export function useActivityInfo(navigate: NavigateFunction): [Activity | null, React.Dispatch<React.SetStateAction<Activity | null>>] {
    const [activity, setActivity] = useState<Activity | null>(null);

    useEffect(() => {
        let ignore = false;

        const user = getAuthenticatedUser();
        if (user !== null) {
            handleGetActivity(navigate)
                .onExecute((response) => {
                    if (!ignore)
                        setActivity(response);
                })
                .execute();
        }
        return () => {
            ignore = true;
        };
    }, [navigate])
    return [activity, setActivity];
}