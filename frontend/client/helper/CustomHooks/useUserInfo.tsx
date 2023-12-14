import React, { useState, useEffect, useRef, DependencyList } from 'react';
import { AuthenticatedUser, getAuthenticatedUser, getSessionToken } from '../user';
import { NavigateFunction } from 'react-router-dom';
import { handleGetUserInfo } from '../userRequestHandler';


export function useUserInfo(navigate: NavigateFunction): AuthenticatedUser | null {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);

    useEffect(() => {
        let ignore = false;

        const auth = getAuthenticatedUser();
        if (auth && !ignore) {
            setUser(auth);
            if (auth.isFirstAccess)
                navigate('/change-password');
        }
        else {
            const token = getSessionToken();
            if (token) {
                handleGetUserInfo(navigate).onExecute((response) => {
                    if (!ignore)
                        setUser(response);
                    if (response.isFirstAccess)
                        navigate('/change-password');
                })
                    .execute();
            }
            else {
                // unauthorized
                navigate("/login");
            }
        }
        return () => {
            ignore = true;
        };

    }, [navigate]);
    return user;
}