import { AnyAction } from "redux";

/**
 * Authentication state and current user's info.
 */
export interface AuthState {
    isLoggedIn: boolean,
    username: string,
    displayName: string,
    email: string,
    confirmationCodeDestination?: string
}

const defaultAuthState = {
    isLoggedIn: false,
    username: '',
    displayName: '',
    email: ''
} as AuthState;

/**
 * Reducer that manages the authentication state
 * @param state current authentication state
 * @param action action to update the state
 * @returns updated state
 */
const authenticationReducer = (state: AuthState = defaultAuthState, action: AnyAction): AuthState => {
    switch (action.type) {
        case 'LOGIN':
            return action.payload;
        case 'LOGOUT':
            return defaultAuthState;
        case 'SIGNUP':
            return action.payload;
        default:
            return state;
    }
};

export default authenticationReducer;