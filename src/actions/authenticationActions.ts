import { AuthState } from "../reducers/authenication"

export const login = (payload: AuthState) => {
    return {
        type: 'LOGIN',
        payload: payload,
    }
}

export const logout = () => {
    return {
        type: 'LOGOUT'
    }
}

export const signup = (payload: AuthState) => {
    return {
        type: 'SIGNUP',
        payload: payload,
    }
}