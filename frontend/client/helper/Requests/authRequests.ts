import { NavigateFunction } from "react-router-dom";
import {
    LoginRequest, UpdatePasswordRequest,
    UpdateUsernameRequest,
    fetchJsonRequest, RequestMethod, fetchAuthenticatedJsonRequest
} from "../requests";
import { saveSessionToken, setAuthenticatedUser, removeSession, LoginResponse, AuthenticatedUser } from '../user';
import { createRequestHandler, RequestBuilder, logout } from "../userRequestHandler";

export function handleLogin(request: LoginRequest, navigate: NavigateFunction): RequestBuilder<LoginResponse> {
    return createRequestHandler<LoginResponse>(
        () => fetchJsonRequest(request, '/api/auth/login', RequestMethod.POST)).onExecute((response) => {
            // Save user and session
            setAuthenticatedUser(response.user);
            saveSessionToken(response.token);
            // Go to home
            navigate("/home");
        });
}

export function handleUpdatePassword(request: UpdatePasswordRequest, navigate: NavigateFunction): RequestBuilder<string> {
    return createRequestHandler<string>(
        () => fetchAuthenticatedJsonRequest(request, '/api/user/password', RequestMethod.PUT))
        .onExecute((response) => {
            logout(navigate);
        })
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleUpdateUsername(request: UpdateUsernameRequest, navigate: NavigateFunction): RequestBuilder<LoginResponse> {
    return createRequestHandler<LoginResponse>(
        () => fetchAuthenticatedJsonRequest(request, '/api/user/username', RequestMethod.PUT))
        .onExecute((response) => {
            setAuthenticatedUser(response.user);
            saveSessionToken(response.token);
            navigate("/home");
        })
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleGetUserInfo(navigate: NavigateFunction): RequestBuilder<AuthenticatedUser> {
    return createRequestHandler<AuthenticatedUser>(
        () => fetchAuthenticatedJsonRequest(null, '/api/user', RequestMethod.GET))
        .onExecute((response) => {
            setAuthenticatedUser(response);
        })
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}