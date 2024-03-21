import React from 'react';

export function useFormEvents<T>(setFunction: React.Dispatch<React.SetStateAction<T>>, onSubmit: () => void):
    [(event: React.ChangeEvent<HTMLInputElement>) => void,
        onSubmit: (event: React.FormEvent) => void] {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFunction((prev) => (
            {
                ...prev,
                [name]: value
            }
        ));
    };
    const onFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit();
    };
    return [handleInputChange, onFormSubmit];
}