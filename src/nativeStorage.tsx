import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

const NATIVE_STORAGE_KEY_PREFIX = '@NativeFreeMarketStorage:';
let dataMemory: any = {};

/** @class */
class NativeKeyValueStorage {
    static syncPromise?: Promise<void> = undefined;
    /**
     * This is used to set a specific item in storage
     */
    static setItem(key: string, value: string) {
        Storage.set({ key: NATIVE_STORAGE_KEY_PREFIX + key, value });
        dataMemory[key] = value;
        return dataMemory[key];
    }

    /**
     * This is used to get a specific key from storage
     */
    static getItem(key: string) {
        return Object.prototype.hasOwnProperty.call(dataMemory, key) ? dataMemory[key] : undefined;
    }

    /**
     * This is used to remove an item from storage
     */
    static removeItem(key: any) {
        Storage.remove({ key: NATIVE_STORAGE_KEY_PREFIX + key });
        return delete dataMemory[key];
    }

    /**
     * This is used to clear the storage
     */
    static clear() {
        dataMemory = {};
        Storage.clear();
        return dataMemory;
    }

    /**
     * Will sync the NativeKeyValueStorage data from Capacitor Storage provider
     * This is required for amplify to work with async storages
    */
    static sync() {
        if (!NativeKeyValueStorage.syncPromise) {
            NativeKeyValueStorage.syncPromise = new Promise(async (res, rej) => {
                try {
                    const { keys } = await Storage.keys();
                    const memoryKeys = keys.filter((key) => key.startsWith(NATIVE_STORAGE_KEY_PREFIX));
                    memoryKeys.map(async (key: string) => {
                        try {
                            const { value } = await Storage.get({ key });
                            const memoryKey = key.replace(NATIVE_STORAGE_KEY_PREFIX, '');
                            dataMemory[memoryKey] = value;
                        } catch (err) {
                            rej(err);
                        }
                    });
                    res();
                } catch (err) {
                    rej(err);
                }
            });
        }

        return NativeKeyValueStorage.syncPromise;
    }
}

export default NativeKeyValueStorage;