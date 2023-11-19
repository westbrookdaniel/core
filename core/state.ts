import { CreateStorageOptions, Storage, createStorage } from "unstorage";

type Opts<T> = { initial?: T; default?: T; dispose?: boolean };
type StorageValue = null | string | number | boolean | object;

export class State<T extends StorageValue> {
  constructor(
    public storage: Storage<T>,
    public key: string,
    public opts?: Opts<T>,
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
    const v = await this.storage.getItem<any>(this.key);
    if (this.opts?.dispose) await this.remove();
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
    return this.storage.setItem<T>(this.key, next);
  }
  has() {
    if (this.opts?.default) return true;
    return this.storage.hasItem(this.key);
  }
  remove() {
    return this.storage.removeItem(this.key);
  }
}

export class ObjectState<T extends object> extends State<T> {
  constructor(storage: Storage<T>, key: string, opts?: Opts<T>) {
    super(storage, key, opts);
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

export function createState(opts?: CreateStorageOptions) {
  const storage = createStorage(opts);
  return {
    newState: <T extends StorageValue>(key: string, opts?: Opts<T>) => {
      return new State<T>(storage, key, opts);
    },
    newObjectState: <T extends object>(key: string, opts?: Opts<T>) => {
      return new ObjectState<T>(storage, key, opts);
    },
  };
}
