import {
    LoginRequest, UpdatePasswordRequest, UpdateUsernameRequest,
    UpdateCategoryOrderRequest, CategoryOrder
} from '../../shared/userRequests'
import { getSessionToken } from './user';
export class ApiError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
    }
}

export enum RequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export async function fetchJsonRequest<T>(request: any, url: string, method: RequestMethod): Promise<T> {
    let body: string | null = null;
    if (request) {
        body = JSON.stringify(request);
    }

    const response = await fetch(url, {
        method: method.toString(),
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
    });
    if (response.status === 200) {
        return response.json();
    }
    else
        throw new ApiError(`Login failed with status code: ${response.status}`, response.status);
}

export async function fetchAuthenticatedJsonRequest<T>(request: any, url: string, method: RequestMethod): Promise<T> {
    const token = getSessionToken();
    if (token === null)
        throw new Error('User is not authenticated');
    let body: string | null = null;
    if (request) {
        body = JSON.stringify(request);
    }
    const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    const response = await fetch(url, {
        method: method.toString(),
        headers,
        body: body,
    });
    if (response.status === 200 || response.status === 201) {
        return response.json();
    }
    else
        throw new ApiError(`update failed with status code: ${response.status}`, response.status);
}

export async function uploadIcon(formData: FormData) {
    const token = getSessionToken();
    if (token === null)
        throw new Error('User is not authenticated');

    const response = await fetch('/api/admins/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            // Content-Type will be set automatically for FormData
        },
        body: formData,
    });
    if (response.status === 200 || response.status === 201) {
        return response.json();
    }
    else
        throw new ApiError(`update failed with status code: ${response.status}`, response.status);
}

export { LoginRequest, UpdatePasswordRequest, UpdateUsernameRequest, UpdateCategoryOrderRequest, CategoryOrder };