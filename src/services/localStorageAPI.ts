export interface IStorage {
   
    getItemAsync(key: string): Promise<string | null>;

    removeItemAsync(key: string): Promise<void>;

    setItemAsync(key: string, value: string): Promise<void>;
}

export class LocalStorageAPI implements IStorage {
    getItemAsync(key: string): Promise<string | null> {
        return Promise.resolve(localStorage.getItem(key));
    }
    
    removeItemAsync(key: string): Promise<void> {
        return Promise.resolve(localStorage.removeItem(key));
    }

    setItemAsync(key: string, value: string): Promise<void> {
        return Promise.resolve(localStorage.setItem(key, value));
    }
}

