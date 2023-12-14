import Cookies from 'js-cookie';

export class AuthenticatedUser {
    id: number;
    username: string;
    role: string;
    isFirstAccess: boolean;
    activityId: number;
    constructor(id: number, username: string, role: string, isFirstAccess: boolean, activityId: number) {
        this.id = id;
        this.username = username!;
        this.role = role!;
        this.isFirstAccess = isFirstAccess!;
        this.activityId = activityId!;
    }
}

export class LoginResponse {
    token: string;
    user: AuthenticatedUser;
    constructor(token: string, user: AuthenticatedUser) {
        this.token = token!;
        this.user = user!;
    }
}

const authEvents = {
    onLogin: new Set<() => void>(),
    onLogout: new Set<() => void>(),
};

export function subscribeToLogin(callback: () => void) {
    authEvents.onLogin.add(callback);
}

export function unsubscribeFromLogin(callback: () => void) {
    authEvents.onLogin.delete(callback);
}

export function subscribeToLogout(callback: () => void) {
    authEvents.onLogout.add(callback);
}

export function unsubscribeFromLogout(callback: () => void) {
    authEvents.onLogout.delete(callback);
}

function triggerLogin() {
    authEvents.onLogin.forEach(callback => callback());
}

function triggerLogout() {
    authEvents.onLogout.forEach(callback => callback());
}

const cookieName = 'session';
let authenticatedUser: AuthenticatedUser | null = null;

export function setAuthenticatedUser(user: AuthenticatedUser | null) {
    authenticatedUser = user;
    triggerLogin();
}

export function getAuthenticatedUser(): AuthenticatedUser | null {
    return authenticatedUser;
}

export function saveSessionToken(token: string) {
    if (token) {
        Cookies.set(cookieName, token);
        triggerLogin();
    }
}

export function getSessionToken(): string | null {
    const token = Cookies.get(cookieName);
    if (token)
        return token;
    else
        return null;
}

export function removeSession() {
    Cookies.remove(cookieName);
    triggerLogout();
}
