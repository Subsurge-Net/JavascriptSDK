// src/apiContext.ts
import { IHttpClient } from './GenericHttpClient';
import { IStorage } from './localStorageAPI';
export interface ApiContext {
    httpClient?: IHttpClient;
    baseUrl?: string;
    appId: string;
    platformName?: 'browser-extension' | 'web' | 'mobile' | 'desktop';
    storage?: IStorage;
    googleClientId?: string;
    auth0ClientId?: string;
    auth0Domain?: string;
}