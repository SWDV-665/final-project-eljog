import { AnyAction } from "redux";

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