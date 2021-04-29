import { Auth } from 'aws-amplify';
import { CompanyProfile, ErrorResponse, Portfolio, ResponseError, StockTradeRequest, StockTradeResponse, SymbolInfo, TransactionType } from '../models';

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

class ApiService {
    private static singleton: ApiService;

    private apiUrlBase: string = "https://freemarket.azurewebsites.net/api/v1";

    private constructor() { }

    public async searchSymbols(prefix: string): Promise<SymbolInfo[]> {
        const uri = `stocks/symbols?prefix=${prefix}`;
        return await this.sendRequest(uri, HttpMethod.Get);
    }

    public async tradeStock(symbol: string, stockTradeRequest: StockTradeRequest, transactionType: TransactionType): Promise<StockTradeResponse> {
        const uri = `stocks/${symbol}/${transactionType === TransactionType.Sell ? 'sell' : 'buy'}`;
        return await this.sendRequest<StockTradeRequest, StockTradeResponse>(uri, HttpMethod.Post, stockTradeRequest);
    }

    public async fetchCompanyProfile(symbol: string): Promise<CompanyProfile> {
        const uri = `stocks/${symbol}/company`;
        return await this.sendRequest(uri, HttpMethod.Get);
    }

    public async fetchPortfolio(): Promise<Portfolio> {
        const uri = 'portfolio';
        return await this.sendRequest(uri, HttpMethod.Get);
    }

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

    public static Instance(): ApiService {
        if (!ApiService.singleton) {
            ApiService.singleton = new ApiService();
        }

        return ApiService.singleton;
    }
}

const apiService = ApiService.Instance();

export { apiService };

