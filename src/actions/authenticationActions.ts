import { AuthState } from "../reducers/authenication"

/**
 * Redux login action that updates the authentication state
 * @param payload new authentication state
 */
export const login = (payload: AuthState) => {
    return {
        type: 'LOGIN',
        payload: payload,
    }
}

/**
 * Redux logout action that clears the authentication state
 */
export const logout = () => {
    return {
        type: 'LOGOUT'
    }
}

/**
 * Redux signup action that updates the state for sign up flow tracking
 * @param payload new state
 */
export const signup = (payload: AuthState) => {
    return {
        type: 'SIGNUP',
        payload: payload,
    }
}