import { IStorage, LocalStorageAPI } from "../services/localStorageAPI";
import { ObservableValue } from "../services/observable-value";
import { ApiContext } from "../services/apiContext";
import { CoreAuthService } from "../services/core-auth.service";
export interface IPlatform {
    storage: IStorage;
}

export class WebPagePlatform implements IPlatform {
    storage: IStorage;
    platformName: string = 'web';
    apiContext: ApiContext;
    browser: any;

    constructor(browser: any, apiContext: ApiContext) {
        this.browser = browser ?? window;
        this.apiContext = apiContext;
        this.storage = new LocalStorageAPI();
    }
}
export class BrowserExtensionPlatform implements IPlatform {
    storage: IStorage;
    browser: any;
    platformName: string = 'browser-extension';
    apiContext: ApiContext;

    constructor(browser: any, apiContext: ApiContext) {
        this.browser = browser;
        this.storage = new BrowserExtensionStorage(browser);
        this.apiContext = apiContext;
    }

    /**
     * Initiate Google OAuth flow to get the id_token, then exchange it for an access token from subsurge
     * make sure you have set the googleClientId in the library configuration and the redirectUri of the browser extension
     * is added to the authorized redirect URIs in the Google Cloud Console
     * @returns 
     */
    async loginWithGoogleAsync(coreAuthService: CoreAuthService) {
        const clientId = this.apiContext.googleClientId;
        if (!clientId) {
            throw new Error('Google client ID is not set in the library configuration make sure you have set the googleClientId in the library configuration');
        }
        const redirectUri = this.browser.identity.getRedirectURL();
        const scopes = ["openid", "email", "profile"];

        const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
            `client_id=${encodeURIComponent(clientId)}` +
            `&response_type=id_token` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${encodeURIComponent(scopes.join(" "))}` +
            `&prompt=select_account`;

        try {
            const redirectUrl = await this.executeWebAuthFlow(authUrl);
            // Extract id_token from the URL
            const urlFragment = new URL(redirectUrl).hash.substring(1);
            const params = new URLSearchParams(urlFragment);
            const idToken = params.get("id_token");

            return coreAuthService.loginWithGoogleToken(idToken!);

        } catch (error) {
            // @ts-ignore
            return { success: false, error: error.message };
        }
    }
    /**
        * Initiate Google OAuth flow to get the id_token, then exchange it for an access token from subsurge
        * make sure you have set the googleClientId in the library configuration and the redirectUri of the browser extension
        * is added to the authorized redirect URIs in the Google Cloud Console
        * @returns 
        */
    async loginWithAuth0Async(coreAuthService: CoreAuthService) {
        const domain = this.apiContext.auth0Domain;
        const clientId = this.apiContext.auth0ClientId;
      
        if (!clientId) {
            throw new Error('Google client ID is not set in the library configuration make sure you have set the googleClientId in the library configuration');
        }
        const redirectUri = this.browser.identity.getRedirectURL();

        const authUrl = `https://${domain}/authorize?` +
        `client_id=${encodeURIComponent(clientId)}` +
        `&response_type=token` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent("openid profile email")}` +
        `&prompt=login`;

        try {
            const redirectUrl = await this.executeWebAuthFlow(authUrl);

            const urlFragment = new URL(redirectUrl).hash.substring(1);
            const params = new URLSearchParams(urlFragment);
            const accessToken = params.get("access_token");

            return coreAuthService.loginWithAuth0Token(accessToken!);
        } catch (error) {
            // @ts-ignore
            return { success: false, error: error.message };
        }
    }
    private async executeWebAuthFlow(authUrl: string): Promise<string> {
        return await new Promise((resolve, reject) => {
            this.browser.identity.launchWebAuthFlow(
                {
                    url: authUrl,
                    interactive: true
                },
                (responseUrl: string) => {
                    if (this.browser.runtime.lastError) {
                        reject(new Error(this.browser.runtime.lastError.message));
                    } else {
                        resolve(responseUrl);
                    }
                }
            );
        });
    }

    listenToObservable(key: string, observable: ObservableValue<any>) {
        observable.subscribe((data) => {
            this.browser.runtime.sendMessage(key, data);
        });
    }
}

export class BrowserExtensionStorage implements IStorage {
    browser: any;
    constructor(browser: any) {
        this.browser = browser;
    }

    async getItemAsync(key: string): Promise<string | null> {
        let value = await this.browser.storage.local.get(key);
        return value[key];
    }

    removeItemAsync(key: string): Promise<void> {
        return this.browser.storage.local.remove(key);
    }

    setItemAsync(key: string, value: string): Promise<void> {
        return this.browser.storage.local.set({ [key]: value });
    }
}
