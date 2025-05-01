import { ApiContext } from "./apiContext";
import { BaseService } from "./base-service";
import { oauthToken } from "./oauthToken";
import { ObservableValue } from "./observable-value";
import { CoreAuthService } from "./core-auth.service";

export class GoogleAuthService extends BaseService {
  private initialized: boolean = false;
  googleUser: ObservableValue<oauthToken | null> = new ObservableValue<oauthToken | null>(null);

  constructor(private apiContext: ApiContext,
    private authService: CoreAuthService
  ) {
    super(apiContext);
  }

  /**
   * This initializes google auth library
   * the google object must be loaded for example with including script https://accounts.google.com/gsi/client
   */
  initializeGoogle(opts?: any) {
    //@ts-ignore
    if (!google || !google.accounts) {
      throw new Error("Google library must be loaded first to use this service, make sure google object is defined and loaded by including script https://accounts.google.com/gsi/client for example");
    }
    if (!this.apiContext.googleClientId) {
      throw new Error("Google client id must be set in googleClientId property of options");
    }
    if (this.initialized) return;
    //@ts-ignore
    google.accounts.id.initialize({
      client_id: this.apiContext.googleClientId,

      itp_support: true,
      cancel_on_tap_outside: false,
      ...opts,
      callback: (response: any) => {
        if (opts.callback && typeof opts.callback === 'function') {
          opts.beforeCallback(response)
        }

        this.authService.loginWithGoogleToken(response.credential)
          .then((r) => {
            this.googleUser.set(response);
            if (opts.callback && typeof opts.callback === 'function') {
              opts.callback(response)
            }
          });
      },
    });
    this.initialized = true;
  }

  renderGoogleButton(element: HTMLElement, btnOptions?: any) {
    //@ts-ignore
    if (!google || !google.accounts) {
      throw new Error("Google library must be loaded first to use this service, make sure google object is defined and loaded by including script https://accounts.google.com/gsi/client for example");
    }
    if (!this.initialized) {
      this.initializeGoogle(this.apiContext.googleClientId);
    }
    // @ts-ignore
    google.accounts.id.renderButton(
      element,
      {
        type: "standard", theme: "outline",
        size: "medium", width: 250,
        // @ts-ignore
        shape: "rectangular", ux_mode: "popup",
        dataType: "standard",
        ...btnOptions
      }
    );
  }

  logout() {
    const user = this.googleUser.get();
    if(!user) return;

    //@ts-ignore
    if(!google || !google.accounts) return;
    //@ts-ignore
    google.accounts.id.disableAutoSelect();
    this.googleUser.set(null);
  }
  // promptGoogleLogin(callback: (notification: any)=>{}) {
  //   //@ts-ignore
  //   if (!google || !google.accounts) {
  //     throw new Error("Google library must be loaded first to use this service, make sure google object is defined and loaded by including script https://accounts.google.com/gsi/client for example");
  //   }
  //   if(!this.initialized) {
  //     throw new Error("Google service must be initialized first by calling method initializeGoogle ");
  //   }


  //   // @ts-ignore
  //   google.accounts.id.prompt((notification: PromptMomentNotification) => {
  //     if (notification.getDismissedReason() === 'credential_returned') {
  //     }
  //   });
  // }
}
