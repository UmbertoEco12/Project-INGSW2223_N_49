import React, { useState, useEffect } from 'react';
import { getAuthenticatedUser } from '../user';
import { NavigateFunction } from 'react-router-dom';
import { handleGetStaff } from '../userRequestHandler';
import { Staff } from '../../../shared/data';


export function useStaff(navigate: NavigateFunction): [Staff[], React.Dispatch<React.SetStateAction<Staff[]>>] {
    const [staff, setStaff] = useState<Staff[]>([]);

    useEffect(() => {
        let ignore = false;

        const user = getAuthenticatedUser();
        if (user !== null) {
            handleGetStaff(navigate)
                .onExecute((response) => {
                    if (!ignore)
                        setStaff(response);
                })
                .execute();
        }
        return () => {
            ignore = true;
        };
    }, [navigate])
    return [staff, setStaff];
}