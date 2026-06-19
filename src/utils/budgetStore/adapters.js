/**
 * StorageAdapter interface definition:
 * interface StorageAdapter {
 *   get(key: string): string | null;
 *   set(key: string, value: string): void;
 * }
 */

export class LocalStorageAdapter {
  get(key) {
    return localStorage.getItem(key);
  }

  set(key, value) {
    localStorage.setItem(key, value);
  }
}

export class InMemoryStorageAdapter {
  constructor(initialData = {}) {
    this.store = new Map(Object.entries(initialData));
  }

  get(key) {
    return this.store.get(key) || null;
  }

  set(key, value) {
    this.store.set(key, value);
  }
}
