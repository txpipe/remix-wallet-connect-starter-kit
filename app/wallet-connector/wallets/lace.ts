import type { Wallet, WalletMetadata } from './base';
import { WALLET_IDS } from './base';

export const laceWallet: Wallet = {
    isAvailable: function (): boolean {
        return !!window?.cardano?.lace;
    },

    enable: async function (): Promise<any> {
        return await window?.cardano?.lace.enable();
    },

    getMetadata: function (): WalletMetadata {
        return {
            id: WALLET_IDS.Lace,
            icon: window?.cardano?.lace?.icon,
            name: window?.cardano?.lace?.name,
            apiVersion: window?.cardano?.lace?.apiVersion,
        };
    },
};