import { ApiContext } from "./apiContext";
import { IStorage } from "./localStorageAPI";

export class BaseService {
    public storage: IStorage;

    get appId() {
        return this.context.appId;
    }
    async bearerTokenAsync(): Promise<string | null> {
      return this.storage.getItemAsync('access_token');
    }

    constructor(private context: ApiContext) {
        this.storage = context.storage!;
    }

    updateContext(context: ApiContext) {
        this.context = context;
    }

    async get<T>(relativeUrl: string, headers?: {
        [header: string]: string;
    }, httpParams?: {
        [param: string]: string;
    }) {
        headers = headers ?? {};
        httpParams = httpParams ?? {};
        const bearerToken = await this.bearerTokenAsync();
        if (bearerToken) {
            headers['Authorization'] = `Bearer ${bearerToken}`;
        }
        return this.context.httpClient!.request<T>({
            method: 'GET',
            url: `${this.context.baseUrl}${relativeUrl}`,
            headers: {
                ...headers
            },
            httpParams: {
                ...httpParams
            }
        });
    }

    async post<T>(relativeUrl: string, body: any | null, headers?: {
        [header: string]: string;
    },
        httpParams?: {
            [param: string]: string;
        }) {
        headers = headers ?? {};
        const bearerToken = await this.bearerTokenAsync();
        if (bearerToken) {
            headers['Authorization'] = `Bearer ${bearerToken}`;
        }
        httpParams = httpParams ?? {};
        return this.context.httpClient!.request<T>({
            method: 'POST',
            url: `${this.context.baseUrl}${relativeUrl}`,
            headers: {
                ...headers
            },
            httpParams: {
                ...httpParams
            },
            body: body
        });
    }
}
