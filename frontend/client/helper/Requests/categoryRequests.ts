import { NavigateFunction } from "react-router-dom";
import { RequestMethod, fetchAuthenticatedJsonRequest } from "../requests";
import { createRequestHandler, RequestBuilder, logout } from "../userRequestHandler";
import { Category } from "../../../shared/data";
import { AddCategoryRequest, UpdateCategoryOrderRequest, UpdateCategoryNameRequest } from "../../../shared/userRequests";

export function handleGetCategories(navigate: NavigateFunction): RequestBuilder<Category[]> {
    return createRequestHandler<Category[]>(
        () => fetchAuthenticatedJsonRequest(null, '/api/menu/categories', RequestMethod.GET))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleAddCategory(request: AddCategoryRequest, navigate: NavigateFunction): RequestBuilder<Category> {
    return createRequestHandler<Category>(
        () => fetchAuthenticatedJsonRequest(request, '/api/menu/categories', RequestMethod.POST))
        .onUnexpectedStatusCode((code) => {
            if (code != 409) {
                logout(navigate);
            }
        })
        .onError((_) => {
            logout(navigate);
        });
}



export function handleDeleteCategory(categoryId: number, navigate: NavigateFunction): RequestBuilder<string> {
    return createRequestHandler<string>(
        () => fetchAuthenticatedJsonRequest(null, `/api/menu/categories/${categoryId}`, RequestMethod.DELETE))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleUpdateCategoryOrder(request: UpdateCategoryOrderRequest, navigate: NavigateFunction): RequestBuilder<string> {
    return createRequestHandler<string>(
        () => fetchAuthenticatedJsonRequest(request, '/api/menu/categories/order', RequestMethod.PUT))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleUpdateCategory(request: UpdateCategoryNameRequest, navigate: NavigateFunction): RequestBuilder<Category> {
    return createRequestHandler<Category>(
        () => fetchAuthenticatedJsonRequest(request, '/api/menu/categories', RequestMethod.PUT))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}