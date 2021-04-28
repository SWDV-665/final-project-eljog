import { Portfolio, Stock } from "../models"

export const updatePortfolio = (payload: Portfolio) => {
    return {
        type: 'UPDATE_PORTFOLIO',
        payload: payload,
    };
}

export const updatePortfolioStock = (payload: Stock) => {
    return {
        type: 'UPDATE_PORTFOLIO_STOCK',
        payload: payload,
    };
}