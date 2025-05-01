// src/httpClient.ts
export interface HttpRequestOptions {
  method: string;
  url: string;
  headers?: {
    [header: string]: string;
  };
  httpParams?: {
    [param: string]: string;
  };
  body?: any;
}

export interface IHttpClient {
  request<T>(options: HttpRequestOptions): Promise<T>;
}

