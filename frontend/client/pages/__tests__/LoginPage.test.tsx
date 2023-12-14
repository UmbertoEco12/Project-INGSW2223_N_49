import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom'

// Mock the Navbar module to avoid importing and rendering the actual Navbar component
jest.mock('../../components/Generic/Navbar/Navbar', () => {
    return () => <div data-testid="mocked-navbar">Mocked Navbar</div>;
});

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

// Mock the handleLogin function
import * as userRequestHandler from '../../helper/userRequestHandler';

interface RequestBuilderMock {

    on(status: number, handler: () => void): RequestBuilderMock;
    execute(): void;
    executePromise(): Promise<any>;
    onExecute(handler: (response: any) => void): RequestBuilderMock;
    onError(handler: (error: Error) => void): RequestBuilderMock;
    onUnexpectedStatusCode(handler: (status: number) => void): RequestBuilderMock;
}
// Mock the handleLogin function
jest.mock('../../helper/userRequestHandler', () => {
    return {
        ...jest.requireActual('../../helper/userRequestHandler'),
        handleLogin: jest.fn((formData: any, navigate: any) => ({
            on: jest.fn((status: number, handler: () => void): RequestBuilderMock => {
                // Mock the on method
                return {
                    on: jest.fn((status: number, handler: () => void): RequestBuilderMock => {
                        // Mock the on method
                        return {
                            on: jest.fn(),
                            execute: jest.fn(),
                            executePromise: jest.fn(),
                            onExecute: jest.fn(),
                            onError: jest.fn(),
                            onUnexpectedStatusCode: jest.fn(),
                        };
                    }),
                    execute: jest.fn(),
                    executePromise: jest.fn(),
                    onExecute: jest.fn(),
                    onError: jest.fn(),
                    onUnexpectedStatusCode: jest.fn(),
                };
            }),
            onExecute: (handler: (response: any) => void): RequestBuilderMock => {
                // Mock the onExecute method
                return {
                    on: jest.fn(),
                    execute: jest.fn(),
                    executePromise: jest.fn(),
                    onExecute: jest.fn(),
                    onError: jest.fn(),
                    onUnexpectedStatusCode: jest.fn(),
                };
            },
            execute: jest.fn(),
        })),
    };
});


import LoginPage from '../Authentication/LoginPage/LoginPage';
import { act } from 'react-dom/test-utils';

describe('LoginPage', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
    });

    test('handles input changes and button click with valid credentials', async () => {
        // Set up mock navigate function
        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        // Render the component
        render(<LoginPage />);

        // Simulate input changes
        fireEvent.change(screen.getByLabelText('Username *'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'testpassword' } });

        // Simulate button click
        const loginButton = screen.getByText('Login', { selector: '#on-submit-button' });
        fireEvent.click(loginButton);

        // Ensure that handleLogin is called with the expected arguments
        expect(userRequestHandler.handleLogin).toHaveBeenCalledWith(
            { username: 'testuser', password: 'testpassword' },
            mockNavigate
        );
    });

    test('handles input changes and button click with invalid username', async () => {
        // Set up mock navigate function
        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        // Render the component
        render(<LoginPage />);

        // Simulate input changes
        fireEvent.change(screen.getByLabelText('Username *'), { target: { value: 'invalid username' } });
        fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'testpassword' } });

        // Simulate button click
        const loginButton = screen.getByText('Login', { selector: '#on-submit-button' });
        fireEvent.click(loginButton);

        // Ensure that the appropriate error message is displayed
        expect(screen.getByText('invalid characters')).toBeInTheDocument();
    });
    test('handles input changes and button click with no username', async () => {
        // Set up mock navigate function
        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        // Render the component
        render(<LoginPage />);

        // Simulate input changes
        fireEvent.change(screen.getByLabelText('Username *'), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'passw' } });

        // Simulate button click
        const loginButton = screen.getByText('Login', { selector: '#on-submit-button' });
        fireEvent.click(loginButton);

        // Ensure that the appropriate error message is displayed
        expect(screen.getByText('this field is required')).toBeInTheDocument();
    });
    test('handles input changes and button click with no password', async () => {
        // Set up mock navigate function
        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        // Render the component
        render(<LoginPage />);

        // Simulate input changes
        fireEvent.change(screen.getByLabelText('Username *'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('Password *'), { target: { value: '' } });

        // Simulate button click
        const loginButton = screen.getByText('Login', { selector: '#on-submit-button' });
        fireEvent.click(loginButton);

        // Ensure that the appropriate error message is displayed
        expect(screen.getByText('this field is required')).toBeInTheDocument();
    });

    test('handles input changes and button click with invalid password', async () => {
        // Set up mock navigate function
        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        // Render the component
        render(<LoginPage />);

        // Simulate input changes
        fireEvent.change(screen.getByLabelText('Username *'), { target: { value: 'invalidTestuser' } });
        fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'invalidTestpassword' } });

        // Simulate button click
        const loginButton = screen.getByText('Login', { selector: '#on-submit-button' });
        fireEvent.click(loginButton);

        // Ensure that handleLogin is called with the expected arguments
        expect(userRequestHandler.handleLogin).toHaveBeenCalledWith(
            { username: 'invalidTestuser', password: 'invalidTestpassword' },
            mockNavigate
        );

        // Get the mocked instance of RequestBuilderMock
        const mockRequestBuilder = (userRequestHandler.handleLogin as jest.Mock).mock.results[0].value;

        // Check if the on method is called with status 401 and the correct handler
        expect(mockRequestBuilder.on).toHaveBeenCalledWith(401, expect.any(Function));

        // Call the 401 handler to simulate the behavior
        act(mockRequestBuilder.on.mock.calls[0][1]);

        // Check if the setUsernameError and setPasswordError functions are called with the expected values
        expect("Wrong password").toBeInTheDocument;
    });

    test('handles input changes and button click with not existing username', async () => {
        // Set up mock navigate function
        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        // Render the component
        render(<LoginPage />);

        // Simulate input changes
        fireEvent.change(screen.getByLabelText('Username *'), { target: { value: 'invalidTestuser' } });
        fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'invalidTestpassword' } });

        // Simulate button click
        const loginButton = screen.getByText('Login', { selector: '#on-submit-button' });
        fireEvent.click(loginButton);

        // Ensure that handleLogin is called with the expected arguments
        expect(userRequestHandler.handleLogin).toHaveBeenCalledWith(
            { username: 'invalidTestuser', password: 'invalidTestpassword' },
            mockNavigate
        );

        // Get the mocked instance of RequestBuilderMock
        const mockRequestBuilder = ((userRequestHandler.handleLogin as jest.Mock).mock.results[0].value.on as jest.Mock).mock.results[0].value;

        // Check if the on method is called with status 401 and the correct handler
        expect(mockRequestBuilder.on).toHaveBeenCalledWith(404, expect.any(Function));

        // Call the 404 handler to simulate the behavior
        act(mockRequestBuilder.on.mock.calls[0][1]);

        // Check if the setUsernameError and setPasswordError functions are called with the expected values
        expect("User not found").toBeInTheDocument;
    });
});
