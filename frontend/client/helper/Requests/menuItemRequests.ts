import { NavigateFunction } from "react-router-dom";
import { RequestMethod, fetchAuthenticatedJsonRequest } from "../requests";
import { CreateMenuItemRequest, UpdateMenuItemRequest, UpdateMenuItemCategoryOrderRequest } from "../../../shared/userRequests";
import { MenuItem } from "../../../shared/data";
import { createRequestHandler, RequestBuilder, logout } from "../userRequestHandler";

export function handleGetMenuItems(navigate: NavigateFunction): RequestBuilder<MenuItem[]> {
    return createRequestHandler<MenuItem[]>(
        () => fetchAuthenticatedJsonRequest(null, '/api/menu/items', RequestMethod.GET))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleCreateMenuItem(request: CreateMenuItemRequest, navigate: NavigateFunction): RequestBuilder<MenuItem> {
    return createRequestHandler<MenuItem>(
        () => fetchAuthenticatedJsonRequest(request, '/api/menu/items', RequestMethod.POST))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleDeleteMenuItem(id: number, navigate: NavigateFunction): RequestBuilder<string> {
    return createRequestHandler<string>(
        () => fetchAuthenticatedJsonRequest(null, `/api/menu/items/${id}`, RequestMethod.DELETE))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleUpdateMenuItem(request: UpdateMenuItemRequest, navigate: NavigateFunction): RequestBuilder<MenuItem> {
    return createRequestHandler<MenuItem>(
        () => fetchAuthenticatedJsonRequest(request, '/api/menu/items', RequestMethod.PUT))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleUpdateMenuItemOrders(request: UpdateMenuItemCategoryOrderRequest, categoryId: number, navigate: NavigateFunction): RequestBuilder<string> {
    return createRequestHandler<string>(
        () => fetchAuthenticatedJsonRequest(request, `/api/menu/items/order/${categoryId}`, RequestMethod.PUT))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleAddMenuItemToCategory(itemId: number, categoryId: number, navigate: NavigateFunction): RequestBuilder<MenuItem> {
    return createRequestHandler<MenuItem>(
        () => fetchAuthenticatedJsonRequest(null, `/api/menu/categories/${categoryId}/items/${itemId}`, RequestMethod.POST))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleRemoveMenuItemFromCategory(itemId: number, categoryId: number, navigate: NavigateFunction): RequestBuilder<MenuItem> {
    return createRequestHandler<MenuItem>(
        () => fetchAuthenticatedJsonRequest(null, `/api/menu/categories/${categoryId}/items/${itemId}`, RequestMethod.DELETE))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}
