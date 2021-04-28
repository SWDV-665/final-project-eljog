export interface SymbolInfo {
    symbol: string;
    companyName: string;
}

export interface CompanyProfile {
    symbol: string;
    companyName: string;
    exchange: string;
    industry: string;
    website: string;
    description: string;
    ceo: string;
    employees?: number;
    tags?: string[];
    priceInfo: PriceInfo;
    address: Address;
}

export interface PriceInfo {
    price: number;
    open: number;
    close: number;
    high: number;
    low: number;
    week52High: number;
    week52Low: number;
}

export interface Address {
    address1: string;
    address2?: string;
    state: string;
    city: string;
    zip: string;
    country: string;
    phone: string;
}

export interface Portfolio {
    balance: number;
    stocks: Stock[];
}

export interface Stock {
    symbol: string;
    shares: number;
    averageCost: number;
    price: number;
}

export enum InvestType {
    Dollars = "Dollars",
    Shares = "Shares",
}

export enum TransactionType {
    Buy = "Buy",
    Sell = "Sell",
}

export interface StockTradeRequest {
    investType: InvestType;
    quantity: number;
}

export interface Transaction {
    symbol: string;
    timestamp: Date;
    investType: InvestType;
    transactionType: TransactionType;
    price: number;
    shares: number;
}

export interface StockTradeResponse {
    transaction: Transaction;
    stock: Stock;
}

export interface ErrorResponse {
    errorCode: string;
    message: string;
}

export class ResponseError extends Error {
    constructor(errorResponse: ErrorResponse) {
        super(errorResponse.message);
    }
}