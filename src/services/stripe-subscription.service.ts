import { ApiContext } from "./apiContext";
import { BaseService } from "./base-service";

export class StripeSubscriptionService extends BaseService {
  constructor(private apiContext: ApiContext) {
    super(apiContext);
  }

  createBuyPackageLink(productId:string, packageId:string) {
    return this.post(`api/v1/stripe/create/${productId}/${packageId}`,{},  {responseType: 'text'});
  } 

  createSubscriptionLink(planId:string) {
    return this.post(`api/v1/stripe/subscribe/${planId}`,{},  {responseType: 'text'});
  }
  
  cancelCurrentSubscription() {
    return this.post(`api/v1/stripe/cancel-subscription`,{});
  } 

}
