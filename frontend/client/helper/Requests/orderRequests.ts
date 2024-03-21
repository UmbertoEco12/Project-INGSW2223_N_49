import { NavigateFunction } from "react-router-dom";
import { RequestMethod, fetchAuthenticatedJsonRequest } from "../requests";
import { CreateOrderRequest, UpdateOrderRequest } from "../../../shared/userRequests";
import { Order, OrderStatus } from "../../../shared/data";
import { createRequestHandler, RequestBuilder, logout } from "../userRequestHandler";


export function handleGetOrders(navigate: NavigateFunction): RequestBuilder<Order[]> {
    return createRequestHandler<Order[]>(
        () => fetchAuthenticatedJsonRequest(null, `/api/orders`, RequestMethod.GET))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleCreateOrder(request: CreateOrderRequest, navigate: NavigateFunction): RequestBuilder<Order> {
    return createRequestHandler<Order>(
        () => fetchAuthenticatedJsonRequest(request, `/api/orders`, RequestMethod.POST))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleUpdateOrder(orderId: number, request: UpdateOrderRequest, navigate: NavigateFunction): RequestBuilder<Order> {
    return createRequestHandler<Order>(
        () => fetchAuthenticatedJsonRequest(request, `/api/orders/${orderId}`, RequestMethod.PUT))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleUpdateItemOrderStatus(itemOrderId: number, status: OrderStatus, navigate: NavigateFunction): RequestBuilder<Order> {
    return createRequestHandler<Order>(
        () => fetchAuthenticatedJsonRequest(null, `/api/orders/${itemOrderId}/${status}`, RequestMethod.PUT))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}

export function handleDeleteOrder(orderId: number, navigate: NavigateFunction): RequestBuilder<Order> {
    return createRequestHandler<Order>(
        () => fetchAuthenticatedJsonRequest(null, `/api/orders/${orderId}`, RequestMethod.DELETE))
        .onUnexpectedStatusCode((_) => {
            logout(navigate);
        })
        .onError((_) => {
            logout(navigate);
        });
}