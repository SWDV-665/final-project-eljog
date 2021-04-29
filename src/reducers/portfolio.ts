import { AnyAction } from "redux";
import { Portfolio, StockTradeResponse, TransactionType } from "../models";

const defaultPortfolioState = {
    balance: 0,
    stocks: [],
} as Portfolio;

const portfolioReducer = (state: Portfolio = defaultPortfolioState, action: AnyAction): Portfolio => {
    switch (action.type) {
        case 'UPDATE_PORTFOLIO':
            return action.payload;
        case 'UPDATE_PORTFOLIO_STOCK':
            const stockTradeResponse = action.payload as StockTradeResponse;
            const stocks = [...state.stocks];
            const index = stocks.findIndex(s => s.symbol == stockTradeResponse.stock.symbol);
            if (index === -1) {
                stocks.push(stockTradeResponse.stock);
            }
            else {
                stocks.splice(index, 1, stockTradeResponse.stock);
            }

            let balance = state.balance;
            if(stockTradeResponse.transaction.transactionType == TransactionType.Buy) {
                balance = balance - (stockTradeResponse.transaction.price * stockTradeResponse.transaction.shares);
            }
            else {
                balance = balance + (stockTradeResponse.transaction.price * stockTradeResponse.transaction.shares);
            }

            return { ...state, stocks: stocks, balance: balance };
        default:
            return state;
    }
}

export default portfolioReducer;