import { Auth } from 'aws-amplify';
import { CompanyProfile, ErrorResponse, Portfolio, ResponseError, StockTradeRequest, StockTradeResponse, SymbolInfo, TransactionType } from '../models';

/**
 * Get the access token for the current user, to make API calls against the service
 */
async function getAccessToken(): Promise<string> {
    const session = await Auth.currentSession();
    if (session.isValid()) {
        return session.getAccessToken().getJwtToken();
    }

    throw new Error("Not logged in");
}

enum HttpMethod {
    Get = "GET",
    Post = "Post"
}

/**
 * Singleton service that allows making rest API calls
 */
class ApiService {
    private static singleton: ApiService;

    private apiUrlBase: string = "https://freemarket.azurewebsites.net/api/v1";

    private constructor() { }

    /**
     * API call to search for stocks
     * @param prefix stock symbol query to search for
     * @returns list of stock symbols that match the query
     */
    public async searchSymbols(prefix: string): Promise<SymbolInfo[]> {
        const uri = `stocks/symbols?prefix=${prefix}`;
        return await this.sendRequest(uri, HttpMethod.Get);
    }

    /**
     * API call to perform a trade (buy/sell)
     * @param symbol stock symbol to buy/sell
     * @param stockTradeRequest trade request object
     * @param transactionType buy/sell
     * @returns trade response that contains the details of the executed trade
     */
    public async tradeStock(symbol: string, stockTradeRequest: StockTradeRequest, transactionType: TransactionType): Promise<StockTradeResponse> {
        const uri = `stocks/${symbol}/${transactionType === TransactionType.Sell ? 'sell' : 'buy'}`;
        return await this.sendRequest<StockTradeRequest, StockTradeResponse>(uri, HttpMethod.Post, stockTradeRequest);
    }

    /**
     * API call to fetch details of a company using the symbol
     * @param symbol stock symbol
     * @returns company details
     */
    public async fetchCompanyProfile(symbol: string): Promise<CompanyProfile> {
        const uri = `stocks/${symbol}/company`;
        return await this.sendRequest(uri, HttpMethod.Get);
    }

    /**
     * API call to fetch the user portfolio
     * @returns the user portfolio that contains the list of stocks owned and the account balance
     */
    public async fetchPortfolio(): Promise<Portfolio> {
        const uri = 'portfolio';
        return await this.sendRequest(uri, HttpMethod.Get);
    }

    /**
     * Utility method to perform an authenticated REST API call
     * @param uri API URI
     * @param method Request method (GET/POST)
     * @param body Request Body
     * @returns the generic API response body of type `TResponse`
     */
    private async sendRequest<TInput, TResponse>(uri: string, method: HttpMethod, body?: TInput): Promise<TResponse> {
        const fullUrl = `${this.apiUrlBase}/${uri}`;
        const accessToken = await getAccessToken();
        const response = await fetch(fullUrl, {
            method: method,
            headers: new Headers({
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(body)
        });
        if (response.ok) {
            const responseData = await response.json() as TResponse;
            return responseData;
        }

        var error = await response.json();
        const errorResponse = error as ErrorResponse;
        if (errorResponse.errorCode) {
            throw new ResponseError(errorResponse);
        }

        throw new Error(error ?? `Unknow API call error while calling ${fullUrl}`);
    }

    /**
     * Singleton instance accessor
     * @returns singleton instance of `ApiService`
     */
    public static Instance(): ApiService {
        if (!ApiService.singleton) {
            ApiService.singleton = new ApiService();
        }

        return ApiService.singleton;
    }
}

const apiService = ApiService.Instance();

export { apiService };

