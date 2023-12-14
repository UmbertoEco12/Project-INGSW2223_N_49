import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import BaseAuthPage from '../Authentication/BaseAuthPage/BaseAuthPage';
import '@testing-library/jest-dom'

test('BaseAuthPage handles input changes, keyboard events, and form submission', () => {
    // Mock functions
    const handleInputChangeMock = jest.fn();
    const onSubmitMock = jest.fn();

    // Define test data
    const fields = [
        { label: 'Username', name: 'username', error: null, value: '' },
        { label: 'Password', name: 'password', error: null, value: '', password: true },
    ];

    // Render the component
    render(
        <BaseAuthPage
            handleInputChange={handleInputChangeMock}
            fields={fields}
            title="Login"
            onSubmit={onSubmitMock}
            buttonText="Submit"
        />
    );

    // Simulate input changes
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });

    // Simulate keyboard events
    fireEvent.keyPress(screen.getByLabelText('Username'), { key: 'Enter', code: 13, charCode: 13 });

    // Simulate form submission
    fireEvent.click(screen.getByText('Submit'));

    // Verify function calls
    expect(handleInputChangeMock).toHaveBeenCalledTimes(2);
    expect(handleInputChangeMock).toHaveBeenCalledWith(expect.any(Object));

    expect(onSubmitMock).toHaveBeenCalled();
});
test('BaseAuthPage displays error messages', () => {
    // Mock functions
    const handleInputChangeMock = jest.fn();
    const onSubmitMock = jest.fn();

    // Define test data with error messages
    const fieldsWithError = [
        { label: 'Username', name: 'username', error: 'Invalid username', value: '', required: true },
        { label: 'Password', name: 'password', error: 'Invalid password', value: '', password: true, required: true },
    ];

    // Render the component with errors
    render(
        <BaseAuthPage
            handleInputChange={handleInputChangeMock}
            fields={fieldsWithError}
            title="Login"
            onSubmit={onSubmitMock}
            buttonText="Submit"
        />
    );

    // Verify error messages are displayed
    expect(screen.getByText('Invalid username')).toBeInTheDocument();
    expect(screen.getByText('Invalid password')).toBeInTheDocument();
});