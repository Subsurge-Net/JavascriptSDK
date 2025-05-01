import { ConsumptionResult, CurrentUserDto, FullAppDto } from './public.types';
import { ApiContext } from "./apiContext";
import { BaseService } from "./base-service";
import { ObservableValue } from "./observable-value"
export class MainService extends BaseService {
  appDefinition: ObservableValue<FullAppDto | null> = new ObservableValue<FullAppDto | null>(null);
  user: ObservableValue<CurrentUserDto | null> = new ObservableValue<CurrentUserDto | null>(null);
  
  constructor(private apiContext: ApiContext) {
    super(apiContext);
  }

  loadProfile() {
    return new Promise<CurrentUserDto>((resolve, reject) => {
      this.get<CurrentUserDto>(`api/v1/main/profile`).then(user => {
        this.user.set(user);
        resolve(user);
      }).catch(err => {
        reject(err);
      })
    })
  }

  loadAppPublicDetails() {
    return new Promise<FullAppDto>((resolve, reject) => {
      this.get<FullAppDto>(`api/v1/main/app/${this.appId}`).then(app => {
        this.appDefinition.set(app);
        resolve(app);
      }).catch(err => {
        reject(err);
      })
    })
  }

  cancelCurrentSubscription() {
    return this.post(`api/v1/main/cancel-subscription`,{});
  }

  consumeAppDetails(productId: string, quantity: number) {
    return this.post<ConsumptionResult>(productId, { quantity });
  }
}
