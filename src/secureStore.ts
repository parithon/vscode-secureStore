import * as keytartype from 'keytar';
import { env } from 'vscode';

declare const __webpack_require__: typeof require;
declare const __non_webpack_require__: typeof require;

function getKeytarModule(): typeof keytartype | undefined {
  const r = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
  try {
    return r(`${env.appRoot}/node_modules.asar/keytar`);
  }
  catch(err) {
    // Not in ASAR.
  }
  try {
    return r(`${env.appRoot}/node_modules/keytar`);
  }
  catch (err) {
    // Not available
  }
  return undefined;
}

export class SecureStore {
  private static keytar: typeof keytartype | undefined = getKeytarModule();
  constructor(
    private readonly serviceName: string,
    private readonly identifier: string
  ){}

  public async set(value: string): Promise<void> {
    await SecureStore.set(this.serviceName, this.identifier, value);
  }

  public async unset(): Promise<boolean> {
    return await SecureStore.unset(this.serviceName, this.identifier);
  }

  public async get(): Promise<string | null> {
    return await SecureStore.get(this.serviceName, this.identifier);
  }

  public static async set(serviceName: string, identifier: string, value: string): Promise<void> {
    return new Promise<void>(async (resolve) => {
      if (SecureStore.keytar && value !== null) {
        await SecureStore.keytar.setPassword(serviceName, identifier, value);
        resolve();
      }
    });    
  }

  public static async unset(serviceName: string, identifier: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      if (SecureStore.keytar) {
        const result = await SecureStore.keytar.deletePassword(serviceName, identifier);
        resolve(result);
      } else {
        resolve(false);
      }
    });
  }

  public static get(serviceName: string, identifier: string): Promise<string | null> {
    return new Promise<string | null>(async (resolve) => {
      if (SecureStore.keytar) {
        const password: string | null = await SecureStore.keytar.getPassword(serviceName, identifier);
        resolve(password);
      } else { resolve(null) }
    });
  }
}