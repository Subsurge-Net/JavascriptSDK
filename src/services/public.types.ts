
export interface BasicAppDto { 
  id: string; 
  name: string;
  description: string;
}
export interface FullAppDto extends BasicAppDto{

  digitalProducts: DigitalProductDto[];
  subscriptionPlans: SubscriptionPlanDto[];
}

export interface PaymentProviderPlanDto {
  externalProviderId: ExternalProviderId
  // The Id from the provider
  externalProviderPlanId: string
}
export interface SubscriptionPlanDto {
  id: string;
  appId: string;
  paused:boolean;
  archived:boolean;
  name: string;
  billingCycle: BillingCycleUnit;
  freeTrialInDays: number;
  price: number; // decimal -> number
  availableProviders: ExternalProviderId[];
  providerPlans: PaymentProviderPlanDto[]
}

export interface DigitalProductDto {
  appId: string;
  id: string;
  name: string;
  description: string;
  digitalProductPackages: DigitalPackageDto[];
}

export interface DigitalPackageDto {
  id: string;
  digitalProductId?: string;
  name: string;
  quantity: number; // long -> number
  price: number; // decimal -> number
}
export interface CurrentUserDto { 
  id?: string;
  isActive?: boolean;
  joinDate?: Date;
  email?: string | null;
  purchasedProducts?: Array<PurchasedProductsDto> | null;
  currentSubscription?: SubscriptionDto;
  readonly hasActiveSubscription?: boolean;
}

export interface PurchasedProductsDto {
  digitalProductId: string; // Guid -> string
  quantity: number; // long -> number
}

export interface SubscriptionDto {
  provider: ExternalProviderId;
  subscriptionPlanId: string; // Guid -> string
  appId: string; // Guid -> string
  status: SubscriptionStatus;
  creationTime: Date;
  billingCycle: BillingCycleUnit;
  lastPaymentDate: Date;
  expirationTime: Date;
}

export interface ExternalProviderCredentials {
  appId: string;
  providerId: ExternalProviderId;
  clientId: string;
  clientSecret: string;
  baseUrl: string;
  extraProperties: {[key : string]: any}
}

export enum ExternalProviderId {
  Paypal = 10,
  Stripe = 20,
  Google = 1010,
  Auth0 = 1020
}

export enum SubscriptionStatus {
  Pending = 0,
  Active = 1,
  Suspended = 2,
  Cancelled = 3,
  Expired = 4,
}


export enum BillingCycleUnit {
  Day = 1,
  Week = 7,
  Month = 30,
  Year = 365,
  Once = 36500,
}
export interface ConsumptionResult {
  remainingQuantity: number;
  success: boolean;
}

