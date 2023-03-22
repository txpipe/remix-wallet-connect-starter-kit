export enum WALLET_IDS {
    CardWallet = 'cardwallet',
    Eternl = 'eternl',
    Flint = 'flint',
    Gero = 'gero',
    Nami = 'nami',
    Typhon = 'typhon',
    Yoroi = 'yoroi',
}

export type WalletMetadata = {
    id: WALLET_IDS;
    icon: string;
    name: string;
    apiVersion: string;
};

export interface Wallet {
    isAvailable(): boolean;
    enable(): Promise<any>;
    getMetadata(): WalletMetadata;
}
