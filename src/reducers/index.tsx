import { combineReducers } from 'redux'
import { Portfolio } from '../models';
import authenticationReducer, { AuthState } from './authenication';
import portfolioReducer from './portfolio';

/**
 * Combined reducer interface
 */
export interface RootState {
    authentication: AuthState,
    portfolio: Portfolio,
}

/**
 * Combined reducer
 */
const allReducers = combineReducers({
    authentication: authenticationReducer,
    portfolio: portfolioReducer,
});

export default allReducers;