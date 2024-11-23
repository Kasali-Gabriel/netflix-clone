/**
 * An array of public routes that do not require authentication
 * @type {string[]}
 */
export const publicRoute = ['/'];

/**
 * An array of routes that are used for authentication
 * @type {string[]}
 */
export const authRoutes = ['/SignIn', '/SignUp', '/SignUp/planform'];

/**
 * Default redirect path after login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/profiles';
