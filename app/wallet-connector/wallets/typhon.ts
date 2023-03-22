import type { Wallet, WalletMetadata } from './base';
import { WALLET_IDS } from './base';

export const typhonWallet: Wallet = {
    isAvailable: function (): boolean {
        return !!window?.cardano?.typhon;
    },

    enable: async function (): Promise<any> {
        return await window?.cardano?.typhon.enable();
    },

    getMetadata: function (): WalletMetadata {
        return {
            id: WALLET_IDS.Typhon,
            icon: window?.cardano?.typhon?.icon,
            name: window?.cardano?.typhon?.name,
            apiVersion: window?.cardano?.typhon?.apiVersion,
        };
    },
};
