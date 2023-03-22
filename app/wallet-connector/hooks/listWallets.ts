import { useEffect, useState } from 'react';
import { getAvailableWallets } from '../wallets';
import type { WalletMetadata } from '../wallets/base';

export const useListWallets = () => {
    const [wallets, setWallets] = useState<WalletMetadata[]>([]);

    useEffect(() => {
        setWallets(getAvailableWallets());
    }, []);

    return wallets;
};
