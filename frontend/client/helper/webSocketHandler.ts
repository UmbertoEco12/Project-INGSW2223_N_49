import { Client, Message, IStompSocket } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { getAuthenticatedUser, subscribeToLogin, subscribeToLogout } from './user'

const socketUrl = '/ratatouille-websocket';
const stompClient = new Client();

stompClient.webSocketFactory = () => new SockJS(socketUrl) as IStompSocket;

const webSocketConnections = {
    onCategoryMessage: new Set<(message: any) => void>(),
    onMenuItemMessage: new Set<(message: any) => void>(),
    onOrderMessage: new Set<(message: any) => void>(),
}
export function subscribeToCategory(callback: (message: any) => void) {
    webSocketConnections.onCategoryMessage.add(callback);
}

export function unsubscribeFromCategory(callback: (message: any) => void) {
    webSocketConnections.onCategoryMessage.delete(callback);
}
function triggerCategory(message: any) {
    webSocketConnections.onCategoryMessage.forEach(callback => callback(message));
}

export function subscribeToMenuItem(callback: (message: any) => void) {
    webSocketConnections.onMenuItemMessage.add(callback);
}

export function unsubscribeFromMenuItem(callback: (message: any) => void) {
    webSocketConnections.onMenuItemMessage.delete(callback);
}
function triggerMenuItem(message: any) {
    webSocketConnections.onMenuItemMessage.forEach(callback => callback(message));
}

export function subscribeToOrder(callback: (message: any) => void) {
    webSocketConnections.onOrderMessage.add(callback);
}

export function unsubscribeFromOrder(callback: (message: any) => void) {
    webSocketConnections.onOrderMessage.delete(callback);
}
function triggerOrder(message: any) {
    webSocketConnections.onOrderMessage.forEach(callback => callback(message));
}
function onLogin() {
    if (stompClient.active) {
        console.log('client already connected');
        return;
    }
    const user = getAuthenticatedUser();
    if (user === null) return;
    console.log('web socket created');
    const activityId = user.activityId;
    stompClient.activate();
    stompClient.onConnect = (frame) => {
        console.log('Connected: ' + frame);

        // Subscribe to the "/topic/categories" destination
        stompClient.subscribe(`/topic/categories/${activityId}`, (message: Message) => {
            // Handle the received message
            const msg = JSON.parse(message.body!);
            triggerCategory(msg);
        });
        stompClient.subscribe(`/topic/menu-items/${activityId}`, (message: Message) => {
            // Handle the received message
            const msg = JSON.parse(message.body!);
            triggerMenuItem(msg);
        });
        stompClient.subscribe(`/topic/orders/${activityId}`, (message: Message) => {
            // Handle the received message
            const msg = JSON.parse(message.body!);
            triggerOrder(msg);
        });
    };
    // Optional: Handle disconnect event
    stompClient.onDisconnect = (frame) => {
        console.log('Disconnected: ' + frame);
    };

    // Optional: Handle WebSocket error event
    stompClient.onStompError = (frame) => {
        console.error('WebSocket error:', frame);
    };
}
function onLogout() {
    stompClient.deactivate();
}
subscribeToLogin(onLogin);
subscribeToLogout(onLogout);