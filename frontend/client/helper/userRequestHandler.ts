import { NavigateFunction } from "react-router-dom";
import { ApiError, fetchJsonRequest, RequestMethod } from "./requests";
import { AuthenticatedUser } from './user';
import { CreateAdminRequest } from "../../shared/userRequests";
import { removeSession } from "./user";
export interface RequestBuilder<T> {

    on(status: number, handler: () => void): RequestBuilder<T>;
    execute(): void;
    executePromise(): Promise<T>;
    onExecute(handler: (response: T) => void): RequestBuilder<T>;
    onError(handler: (error: Error) => void): RequestBuilder<T>;
    onUnexpectedStatusCode(handler: (status: number) => void): RequestBuilder<T>;
}

export function createRequestHandler<T>(requestFn: () => Promise<T>) {
    const handlers: { [key: number]: () => void } = {};
    const onExecuteHandlers: Array<(response: T) => void> = [];
    const onErrorHandlers: Array<(error: Error) => void> = [];
    const OnUnexpectedHandlers: Array<(status: number) => void> = [];

    const builder: RequestBuilder<T> = {
        on: (status, handler) => {
            handlers[status] = handler;
            return builder;
        },
        onExecute: (handler) => {
            onExecuteHandlers.push(handler);
            return builder;
        },
        onError: (handler) => {
            onErrorHandlers.push(handler);
            return builder;
        },
        onUnexpectedStatusCode: (handler) => {
            OnUnexpectedHandlers.push(handler);
            return builder;
        },
        execute: () => {
            requestFn()
                .then((response) => {
                    onExecuteHandlers.forEach((handler) => handler(response));
                })
                .catch((error: ApiError | Error) => {
                    if (error instanceof ApiError) {
                        const handler = handlers[error.statusCode];
                        if (handler) {
                            handler();
                        } else {
                            console.error(`Unexpected status code: ${error.statusCode}`);
                            OnUnexpectedHandlers.forEach((handler) => handler(error.statusCode));
                        }
                    } else {
                        console.error(`Unexpected error: ${error}`);
                        onErrorHandlers.forEach((handler) => handler(error));
                    }
                });
        },
        executePromise: async () => {
            try {
                const response = await requestFn();
                onExecuteHandlers.forEach((handler) => handler(response));
                return response;
            } catch (error: ApiError | Error | any) {
                if (error instanceof ApiError) {
                    const handler = handlers[error.statusCode];
                    if (handler) {
                        handler();
                    } else {
                        console.error(`Unexpected status code: ${error.statusCode}`);
                        OnUnexpectedHandlers.forEach((handler) => handler(error.statusCode));
                    }
                } else {
                    console.error(`Unexpected error: ${error}`);
                    onErrorHandlers.forEach((handler) => handler(error));
                }
                throw error; // Rethrow the error
            }
        },
    }
    return builder;
}

export function logout(navigate: NavigateFunction) {
    removeSession();
    navigate('/login');
}

export * from './Requests/authRequests';
export * from './Requests/activityRequests';
export * from './Requests/staffRequests';
export * from './Requests/categoryRequests';
export * from './Requests/menuItemRequests';
export * from './Requests/orderRequests';


export function handleCreateAdmin(admin: CreateAdminRequest, navigate: NavigateFunction): RequestBuilder<AuthenticatedUser> {
    return createRequestHandler<AuthenticatedUser>(
        () => fetchJsonRequest(admin, `/api/admins`, RequestMethod.POST))
        .onExecute((response) => {
        }).onUnexpectedStatusCode(() => logout(navigate))
}
