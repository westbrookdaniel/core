import {
  CreateStorageOptions,
  Storage,
  StorageValue,
  createStorage,
} from "unstorage";

export function createState(opts?: CreateStorageOptions) {
  const storage: Storage<StorageValue> = createStorage(opts);

  class State<T extends StorageValue> {
    constructor(
      public key: string,
      public opts?: { initial?: T; default?: T },
    ) {
      if (opts) {
        if (opts.initial !== undefined) {
          storage.setItem(key, opts.initial);
        } else if (opts.default !== undefined) {
          storage.setItem(key, opts.default);
        }
      }
    }

    async get(): Promise<T> {
      const v = await storage.getItem<any>(this.key);
      return v ?? this.opts?.default;
    }
    async set(value: T | ((prev: T) => T)) {
      let next: T;
      if (typeof value === "function") {
        const prev = await this.get();
        next = value(prev);
      } else {
        next = value;
      }
      return storage.setItem<T>(this.key, next);
    }
    has() {
      if (this.opts?.default) return true;
      return storage.hasItem(this.key);
    }
    remove() {
      return storage.removeItem(this.key);
    }
  }

  class ObjectState<T extends object> extends State<T> {
    constructor(key: string, opts?: { initial?: T; default?: T }) {
      super(key, opts);
    }

    async getKey(key: keyof T) {
      const v = await super.get();
      return v?.[key] ?? this.opts?.default?.[key];
    }

    async setKey(key: keyof T, value: T[keyof T]) {
      const prev = await super.get();
      return super.set({ ...prev, [key]: value });
    }

    async hasKey(key: keyof T) {
      if (this.opts?.default?.[key]) return true;
      const v = await super.get();
      return v?.[key] !== undefined;
    }

    async hasKeys() {
      const v = await super.get();
      if (v === undefined) return false;
      return Object.keys(v).length > 0;
    }
  }

  return { State, ObjectState, storage };
}
