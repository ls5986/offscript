import {
  AppData,
  AppDataSchema,
  initialData,
  OffScriptRepository,
} from "./model";
export class WebRepository implements OffScriptRepository {
  private db: IDBDatabase | null = null;
  async initialize() {
    this.db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("off-script", 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains("state"))
          request.result.createObjectStore("state");
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(
          Error(
            "Browser storage is unavailable. Allow site storage to save your games.",
          ),
        );
      request.onblocked = () =>
        reject(Error("Close older Off Script tabs and try again."));
    });
  }
  async read() {
    if (!this.db) throw Error("Storage has not opened.");
    const value = await new Promise<unknown>((resolve, reject) => {
      const r = this.db!.transaction("state", "readonly")
        .objectStore("state")
        .get("app");
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    return value === undefined ? initialData() : AppDataSchema.parse(value);
  }
  async write(data: AppData) {
    const parsed = AppDataSchema.parse(data);
    await new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject(Error("Browser storage is unavailable."));
        return;
      }
      const tx = this.db.transaction("state", "readwrite");
      tx.objectStore("state").put(parsed, "app");
      tx.oncomplete = () => resolve();
      tx.onerror = () =>
        reject(
          Error(
            "Your browser could not save this change. Check available storage.",
          ),
        );
      tx.onabort = () => reject(Error("Save interrupted. Please try again."));
    });
  }
  async resetAllLocalData() {
    if (!this.db) await this.initialize();
    await this.write(initialData());
  }
}
export const repository = new WebRepository();
