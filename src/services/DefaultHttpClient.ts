// src/fetchHttpClient.ts
import { IHttpClient, HttpRequestOptions } from './GenericHttpClient';

export class FetchHttpClient implements IHttpClient {
  async request<T>({ method, url, headers, body, httpParams }: HttpRequestOptions): Promise<T> {
    headers = headers ?? {};
    if (httpParams && Object.entries(httpParams).length > 0) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(httpParams)) {
        params.append(key, value);
      }
      body = params;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    if(headers?.['responseType']?.includes('text')){
      return response.text() as Promise<T>;
    }
    return response.json();
  }
}
