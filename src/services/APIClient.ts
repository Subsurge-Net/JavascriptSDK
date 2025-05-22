import { ApiContext } from "./apiContext";
import { FetchHttpClient } from "./DefaultHttpClient";
import { GoogleAuthService } from "./google-auth.service";
import { MainService } from "./main.service";
import { ObservableValue } from "./observable-value";
import { CoreAuthService } from "./core-auth.service";
import { PaypalSubscriptionService } from "./paypal-subscription.service";
import { CurrentUserDto, FullAppDto } from "./public.types";
import { StripeSubscriptionService } from "./stripe-subscription.service";
import { LocalStorageAPI } from "./localStorageAPI";
import { BrowserExtensionPlatform } from "../platform-specific/browser-extension";

export class APIClient {
    private apiContext: ApiContext;

    auth: CoreAuthService;
    main: MainService;
    paypal: PaypalSubscriptionService;
    stripe: StripeSubscriptionService;
    googleAuthService: GoogleAuthService;

    user$: ObservableValue<CurrentUserDto | null> = new ObservableValue<CurrentUserDto | null>(null);
    app$: ObservableValue<FullAppDto | null> = new ObservableValue<FullAppDto | null>(null);
    loggedIn$: ObservableValue<boolean> = new ObservableValue<boolean>(false);

    platform: any;

    constructor(options: ApiContext, platform?: any) {
        this.apiContext = options;
        //-- override some options
        this.apiContext.baseUrl = ensureEndsWith(options?.baseUrl, '/') ?? "https://subsurge.net/";
        this.apiContext.httpClient = options.httpClient ?? new FetchHttpClient();
        
      
        if(options.platformName === 'browser-extension') {
            this.platform = new BrowserExtensionPlatform(platform, this.apiContext);
            this.apiContext.storage = options.storage ?? this.platform.storage;
        } else {
            this.apiContext.storage = options.storage ?? new LocalStorageAPI();
        }
     
        this.auth = new CoreAuthService(this.apiContext);
        this.main = new MainService(this.apiContext);
        this.paypal = new PaypalSubscriptionService(this.apiContext);
        this.stripe = new StripeSubscriptionService(this.apiContext);



        this.googleAuthService = new GoogleAuthService(this.apiContext, this.auth);
        // this.googleAuthService.googleUser.subscribe(user => {
        //     if (!!user) {
        //         this.main.loadProfile();
        //     }
        // })

        this.loggedIn$ = this.auth.loggedIn;
        this.user$ = this.main.user;
        this.app$ = this.main.appDefinition;

        this.main.loadAppPublicDetails();
    }
    /**
     * Load the user's profile
     * @returns 
     */
    loadUserInfo() {
        return this.main.loadProfile();
    }

    /**
     * Load the app's public details (app name, description, subscription plans, digital products, etc.)
     * @returns 
     */
    loadAppDetails() {
        return this.main.loadAppPublicDetails();
    }

    /**
     * Login with Google flow (currently only supported on browser extension)
     * @returns 
     */
    loginWithGoogleFlow() {
        if(this.platform.platformName === 'browser-extension') {
            return this.platform.loginWithGoogleAsync(this.auth);
        }
        throw new Error('Login with Google flow is not supported on this platform');
    }

    /**
     * Login with Auth0 flow (currently only supported on browser extension)
     * @returns 
     */
    loginWithAuth0Flow() {
        if(this.platform.platformName === 'browser-extension') {
            return this.platform.loginWithAuth0Async(this.auth);
        }
        throw new Error('Login with Auth0 flow is not supported on this platform');
    }

    /**
     * Login with Google Id_token 
     * @param googleIdToken 
     * @returns 
     */
    loginWithGoogleToken(googleIdToken: string) {
        return this.auth.loginWithGoogleToken(googleIdToken);
    }

    /**
     * Login with Auth0 access_token 
     * @param auth0IdToken 
     * @returns 
     */
    loginWithAuth0Token(auth0IdToken: string) {
        return this.auth.loginWithAuth0Token(auth0IdToken);
    }

    async logoutAsync() {
        this.user$.set(null);
        await this.auth.logoutAsync();
        this.googleAuthService.logout();
    }

    /**
     * Check if the user is authenticated to subsurge
     * @returns 
     */
    isAuthenticated() {
        return this.auth.isAuthenticatedAsync();
    }

    /**
     * Create a payment link for a product and package
     * @param productId on subsurge
     * @param packageId on subsurge
     * @param provider 'paypal' or 'stripe'
     * @returns 
     */
    createPaymentLink(productId: string, packageId: string, provider: 'paypal' | 'stripe') {
        let cleanProvider = provider?.toLowerCase();
        if (cleanProvider === 'paypal') {
            return this.paypal.createBuyPackageLink(productId, packageId);
        } else if (cleanProvider === 'stripe') {
            return this.stripe.createBuyPackageLink(productId, packageId);
        }
        throw new Error('Invalid provider');
    }

    /**
     * Create a subscription link for a plan
     * @param planId on subsurge
     * @param provider 'paypal' or 'stripe'
     * @returns 
     */
    createSubscriptionLink(planId: string, provider: 'paypal' | 'stripe') {
        let cleanProvider = provider?.toLowerCase();
        if (cleanProvider === 'paypal') {
            return this.paypal.createSubscriptionLink(planId);
        } else if (cleanProvider === 'stripe') {
            return this.stripe.createSubscriptionLink(planId);
        }
        throw new Error('Invalid provider');
    }

    /**
     * Cancel the current user's subscription if it exists on subsurge and the provider
     * @returns 
     */
    cancelCurrentSubscription() {
        return this.main.cancelCurrentSubscription();
    }
}

function ensureEndsWith(str: string | undefined, suffix: string): string | null {
    if (!str) {
        return null;
    }
    if (!str.endsWith(suffix)) {
        return str + suffix;
    }
    return str;
}