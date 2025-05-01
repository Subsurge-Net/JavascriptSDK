import { ApiContext } from "./apiContext";
import { BaseService } from "./base-service";
import { ObservableValue } from "./observable-value";
import { oauthToken } from "./oauthToken";

export class CoreAuthService extends BaseService {
  loggedIn: ObservableValue<boolean> = new ObservableValue<boolean>(false);

  constructor(private apiContext: ApiContext) {
    super(apiContext);
    this.setAppIdAsync(apiContext.appId);
  }

  loginWithGoogleToken(googleIdToken: string) {
    let httpParams = {
      client_id: this.appId,
      grant_type: 'google_token',
      assertion: googleIdToken
    }
    return this.connectTokenRequest(httpParams);
  }

  loginWithAuth0Token(auth0IdToken: string) {
    let httpParams = {
      client_id: this.appId,
      grant_type: 'auth0_token',
      assertion: auth0IdToken
    }

    return this.connectTokenRequest(httpParams);
  }

  async loginWithRefreshTokenAsync() {
    let refreshToken = await this.refreshTokenAsync;
    if (!refreshToken) return;

    let httpParams = {
      client_id: this.appId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }

    return this.connectTokenRequest(httpParams);
  }
  private connectTokenRequest(httpParams: any): Promise<oauthToken> {
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    return new Promise((resolve, reject) => {
      this.post<any>('connect/token', null, headers, httpParams).then((r) => {
        this.updateTokens(r);
        this.loggedIn.set(true);
        resolve(r);
      })
        .catch(e => reject(e));
    });
  }
  async updateTokens(token: oauthToken) {
    await this.storage.setItemAsync('access_token', token.access_token);
    await this.storage.setItemAsync('refresh_token', token.refresh_token);
    const future = new Date(Date.now() + token.expires_in * 1000);
    await this.storage.setItemAsync('access_token_expires_at', future.toString());
  }

  setAppIdAsync(appId: string) {
    this.storage.setItemAsync('app_id', appId);
  }

  getAppIdAsync(): Promise<string | null> {
    return this.storage.getItemAsync('app_id');
  }

  async logoutAsync() {
    await this.storage.removeItemAsync('access_token');
    await this.storage.removeItemAsync('refresh_token');
    await this.storage.removeItemAsync('access_token_expires_at');
    this.loggedIn.set(false);
  }

  async isAuthenticatedAsync(): Promise<boolean> {
    const hasTokenExpired = await this.hasTokenExpiredAsync();
    
    if (hasTokenExpired) {
      await this.loginWithRefreshTokenAsync()
    }
    const hasToken = !!this.accessTokenAsync;
    return hasToken && !hasTokenExpired;
  }

  get accessTokenAsync(): Promise<string | null> {
    return this.storage.getItemAsync('access_token');
  }
  get refreshTokenAsync(): Promise<string | null> {
    return this.storage.getItemAsync('refresh_token');
  }

  async hasTokenExpiredAsync() {
    let dateAsString = await this.storage.getItemAsync('access_token_expires_at');
    return dateAsString != null ? new Date(dateAsString) < new Date() : true;
  }

}
