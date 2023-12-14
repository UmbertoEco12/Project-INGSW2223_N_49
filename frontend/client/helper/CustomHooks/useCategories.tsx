import React, { useState, useEffect } from 'react';
import { getAuthenticatedUser } from '../user';
import { NavigateFunction } from 'react-router-dom';
import { handleGetCategories } from '../userRequestHandler';
import { subscribeToCategory, unsubscribeFromCategory } from '../webSocketHandler';
import { Category } from '../../../shared/data';

export function useCategories(navigate: NavigateFunction): [Category[], React.Dispatch<React.SetStateAction<Category[]>>] {
    const [categories, setCategories] = useState<Category[]>([]);

    const parseCategoryMessage = (message: any) => {
        setCategories(message);
    };

    useEffect(() => {
        let ignore = false;
        const user = getAuthenticatedUser();
        if (user !== null) {

            handleGetCategories(navigate)
                .onExecute(
                    (response) => {
                        if (!ignore) {
                            setCategories(response);
                        }
                    })
                .execute();
            subscribeToCategory(parseCategoryMessage);
        }
        return () => {
            ignore = true;
            unsubscribeFromCategory(parseCategoryMessage);
        };
    }, [navigate])

    return [categories, setCategories];
}