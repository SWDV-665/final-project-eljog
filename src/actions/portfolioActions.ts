import { Portfolio, StockTradeResponse } from "../models";

/**
 * Redux action that updates the portfolio state,
 * when the portfolio data is recieved from the server.
 * @param payload portfolio data
 */
export const updatePortfolio = (payload: Portfolio) => {
    return {
        type: 'UPDATE_PORTFOLIO',
        payload: payload,
    };
}

/**
 * Redux action that updates the info for a stock in the portfolio state,
 * when a trade (buy/sell) is performed on that stock
 * @param payload stock trade info
 */
export const updatePortfolioStock = (payload: StockTradeResponse) => {
    return {
        type: 'UPDATE_PORTFOLIO_STOCK',
        payload: payload,
    };
}