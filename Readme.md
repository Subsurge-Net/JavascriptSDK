# The JavascriptSDK for Subsurge.Net

## Introduction:

the sdk contains many classes the most important one that's explained here in details is 
The APIClient class, since it contains the core functions that you need to manage user login and payments.

First step is to initialize the client with the required data:

**Make sure that you completed the setup properly subsurge.net, and used the same client Id for that app**


**Minimal Setup Example**  

```ts

const clientSDK = new SubsurgeSDK.APIClient({
    appId: '{{YOUR_APP_ID}}', // App Id on subsurge.com e.g 21a79421a7964ddcbf41222829041194
    // Google Client Id If you want to use Google Auth
    googleClientId: "{{YOUR Google ClientId}}", // e."920059261823-zh90m3p3hhtvrk8sk1kinuak1thjdwve.apps.googleusercontent.com",
}); 

```
**Example on a background.js page for a browser extension:**  

```ts

const clientSDK = new SubsurgeSDK.APIClient({
    appId: '{{YOUR_APP_ID}}', // App Id on subsurge.com e.g 21a79421a7964ddcbf41222829041194
    // On background.js, we need to use the platformName 'browser-extension' 
    platformName: 'browser-extension',
    // Auth0 Client Id & Domain If you want to use Auth0 Auth
    auth0ClientId: "{{YOUR Auth0 ClientId}}", // for example "z2Nw7xeikj0s9wJSIOdaPuXdG8Q94125"
    auth0Domain: "{{YOUR Auth0 Domain}}" // e.g  "dev-wf241mdmk.us.auth0.com"
}, chrome); 
```

## API Client Documentation

#### Methods

---

#### `loadUserInfo()`

**Description:**  
Load the current user's profile information.

**Returns:**  
`Promise<CurrentUserDto>`

**Example:**
```ts
const user = await apiClient.loadUserInfo();
console.log(user.email);
```

---

#### `loadAppDetails()`

**Description:**  
Load the app's public details such as name, description, subscription plans, and digital products.

**Returns:**  
`Promise<FullAppDto>`

**Example:**
```ts
const appDetails = await apiClient.loadAppDetails();
console.log(appDetails.name);
```

---

#### `loginWithGoogleFlow()`

**Description:**  
Initiates the Google login flow. Only supported in browser extensions.

**Returns:**  
`any`

**Example:**
```ts
await apiClient.loginWithGoogleFlow();
```

---

#### `loginWithAuth0Flow()`

**Description:**  
Initiates the Auth0 login flow. Only supported in browser extensions.

**Returns:**  
`any`

**Example:**
```ts
await apiClient.loginWithAuth0Flow();
```

---

#### `loginWithGoogleToken(googleIdToken: string)`

**Description:**  
Login using a Google `id_token`.

**Parameters:**
- `googleIdToken` *(string)*: The Google ID token.

**Returns:**  
`Promise<oauthToken>`

**Example:**
```ts
const token = await apiClient.loginWithGoogleToken("your-google-id-token");
```

---

#### `loginWithAuth0Token(auth0IdToken: string)`

**Description:**  
Login using an Auth0 `access_token`.

**Parameters:**
- `auth0IdToken` *(string)*: The Auth0 access token.

**Returns:**  
`Promise<oauthToken>`

**Example:**
```ts
const token = await apiClient.loginWithAuth0Token("your-auth0-id-token");
```

---

#### `logoutAsync()`

**Description:**  
Logs out the current user.

**Returns:**  
`Promise<void>`

**Example:**
```ts
await apiClient.logoutAsync();
```

---

#### `isAuthenticated()`

**Description:**  
Check if the user is authenticated.

**Returns:**  
`Promise<boolean>`

**Example:**
```ts
const loggedIn = await apiClient.isAuthenticated();
```

---

#### `createPaymentLink(productId: string, packageId: string, provider: 'paypal' | 'stripe')`

**Description:**  
Create a payment link for a specific product and package.

**Parameters:**
- `productId` *(string)*: The product ID on Subsurge.
- `packageId` *(string)*: The package ID on Subsurge.
- `provider` *('paypal' | 'stripe')*: The payment provider.

**Returns:**  
`Promise<unknown>`

**Example:**
```ts
const link = await apiClient.createPaymentLink("prod123", "pkg456", "stripe");
```

---

#### `createSubscriptionLink(planId: string, provider: 'paypal' | 'stripe')`

**Description:**  
Create a subscription link for a specific plan.

**Parameters:**
- `planId` *(string)*: The subscription plan ID.
- `provider` *('paypal' | 'stripe')*: The payment provider.

**Returns:**  
`Promise<unknown>`

**Example:**
```ts
const link = await apiClient.createSubscriptionLink("plan789", "paypal");
```

---

#### `cancelCurrentSubscription()`

**Description:**  
Cancel the current user's subscription if it exists on Subsurge.

**Returns:**  
`Promise<unknown>`

**Example:**
```ts
await apiClient.cancelCurrentSubscription();
```
