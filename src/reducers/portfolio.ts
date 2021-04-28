import { AnyAction } from "redux";
import { Portfolio } from "../models";

const defaultPortfolioState = {
    balance: 0,
    stocks: [],
} as Portfolio;

const portfolioReducer = (state: Portfolio = defaultPortfolioState, action: AnyAction): Portfolio => {
    switch (action.type) {
        case 'UPDATE_PORTFOLIO':
            return action.payload;
        case 'UPDATE_PORTFOLIO_STOCK':
            const stocks = [...state.stocks];
            const index = stocks.findIndex(s => s.symbol == action.payload.symbol);
            if (index === -1) {
                stocks.push(action.payload);
            }
            else {
                stocks.splice(index, 1, action.payload);
            }

            return { ...state, stocks: stocks };
        default:
            return state;
    }
}

export default portfolioReducer;