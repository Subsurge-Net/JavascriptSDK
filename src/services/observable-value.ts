type Callback<T> = (value: T) => void;

export class ObservableValue<T> {
  private value: T;
  private listeners: Set<Callback<T>> = new Set();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  subscribe(callback: Callback<T>, emitCurrent = true): () => void {
    this.listeners.add(callback);
    if (emitCurrent) {
      callback(this.value);
    }

    // Return unsubscribe function
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback: Callback<T>) {
    this.listeners.delete(callback);
  }

  set(value: T) {
    if (this.value !== value) {
      this.value = value;
      this.notify();
    }
  }

  get(): T {
    return this.value;
  }

  private notify() {
    for (const cb of this.listeners) {
      cb(this.value);
    }
  }
}
