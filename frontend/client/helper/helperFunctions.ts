export function cleanString(input: string): string {
    // Trim the string
    let cleanedString = input.trim();

    // Convert to lower case
    cleanedString = cleanedString.toLowerCase();

    // Replace multiple spaces with a single space
    cleanedString = cleanedString.replace(/\s+/g, ' ');

    return cleanedString;
}

export const weakPasswordError: string = "Password must be at least 8 characters long,\ncontain at least one uppercase letter,\ncontain at least one lowercase letter\n and contain at least one digit.";

export function isPasswordWeak(password: string): boolean {
    // Check if the password is at least 8 characters long
    if (password.length < 8) {
        return true;
    }

    // Check for at least one uppercase letter, one lowercase letter, and one number
    let hasUppercase = false;
    let hasLowercase = false;
    let hasDigit = false;

    for (const ch of password) {
        if (ch >= 'A' && ch <= 'Z') {
            hasUppercase = true;
        } else if (ch >= 'a' && ch <= 'z') {
            hasLowercase = true;
        } else if (ch >= '0' && ch <= '9') {
            hasDigit = true;
        }
    }

    // Password is weak if any of the criteria are not met
    return !(hasUppercase && hasLowercase && hasDigit);
}