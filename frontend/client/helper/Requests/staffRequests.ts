import { NavigateFunction } from "react-router-dom";
import { RequestMethod, fetchAuthenticatedJsonRequest } from "../requests";
import { CreateStaffRequest } from "../../../shared/userRequests";
import { Staff } from "../../../shared/data";
import { createRequestHandler, RequestBuilder, logout } from "../userRequestHandler";

export function handleGetStaff(navigate: NavigateFunction): RequestBuilder<Staff[]> {
    return createRequestHandler<Staff[]>(
        () => fetchAuthenticatedJsonRequest(null, '/api/admins/staff', RequestMethod.GET))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleCreateStaff(request: CreateStaffRequest, navigate: NavigateFunction): RequestBuilder<Staff> {
    return createRequestHandler<Staff>(
        () => fetchAuthenticatedJsonRequest(request, '/api/admins/staff', RequestMethod.POST))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleDeleteStaff(userId: number, navigate: NavigateFunction): RequestBuilder<string> {
    return createRequestHandler<string>(
        () => fetchAuthenticatedJsonRequest(null, `/api/admins/staff/${userId}`, RequestMethod.DELETE))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}