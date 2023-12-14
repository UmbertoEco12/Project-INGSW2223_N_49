import { NavigateFunction } from "react-router-dom";
import { RequestMethod, fetchAuthenticatedJsonRequest, uploadIcon } from "../requests";
import { createRequestHandler, logout, RequestBuilder } from "../userRequestHandler";
import { Activity } from "../../../shared/data";
import { UpdateActivityRequest } from "../../../shared/userRequests";

export function handleGetActivity(navigate: NavigateFunction): RequestBuilder<Activity> {
    return createRequestHandler<Activity>(
        () => fetchAuthenticatedJsonRequest(null, '/api/admins/activity', RequestMethod.GET))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleUpdateActivity(request: UpdateActivityRequest, navigate: NavigateFunction): RequestBuilder<Activity> {
    return createRequestHandler<Activity>(
        () => fetchAuthenticatedJsonRequest(request, '/api/admins/activity', RequestMethod.PUT))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleUploadActivityIcon(request: FormData, navigate: NavigateFunction): RequestBuilder<string> {
    return createRequestHandler<string>(
        () => uploadIcon(request))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}