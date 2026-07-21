export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

export class LocalStorageAdapter implements StorageAdapter {
  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}

export class InMemoryStorageAdapter implements StorageAdapter {
  private store: Map<string, string>;

  constructor(initialData: Record<string, string> = {}) {
    this.store = new Map(Object.entries(initialData));
  }

  get(key: string): string | null {
    return this.store.get(key) || null;
  }

  set(key: string, value: string): void {
    this.store.set(key, value);
  }
}
