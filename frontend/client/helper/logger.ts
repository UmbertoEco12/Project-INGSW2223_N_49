import { getAuthenticatedUser } from "./user";


export function customLog(msg: string) {
    const timestamp = new Date().toISOString();
    var user = getAuthenticatedUser();
    if (user) {
        console.log(`[${timestamp}]- ${msg} -[${user.username}:${user.role}]`);
    }
    else {
        console.log(`[${timestamp}]- ${msg}`);
    }
}