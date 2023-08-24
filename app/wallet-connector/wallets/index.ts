import type { WalletMetadata } from "./base";
import { cardWallet } from "./cardwallet";
import { eternlWallet } from "./eternl";
import { flintWallet } from "./flint";
import { geroWallet } from "./gero";
import { namiWallet } from "./nami";
import { typhonWallet } from "./typhon";
import { yoroiWallet } from "./yoroi";
import { laceWallet } from "~/wallet-connector/wallets/lace";

export const SUPPORTED_WALLETS = [
    cardWallet,
    eternlWallet,
    flintWallet,
    geroWallet,
    namiWallet,
    typhonWallet,
    yoroiWallet,
    laceWallet
];

export function getAvailableWallets(): WalletMetadata[] {
    return SUPPORTED_WALLETS
        .filter(wallet => wallet.isAvailable())
        .map(wallet => wallet.getMetadata())
}
