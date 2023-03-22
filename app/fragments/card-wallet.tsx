import type { WalletMetadata } from "~/wallet-connector/wallets/base";

export function CardWallet(props: { metadata: WalletMetadata; selected: boolean; onClick: () => void }) {
  return (
    <div
      className={`p-6 rounded-md bg-gray-900 transition-all cursor-pointer ${
        props.selected ? "shadow-sm-txpink" : "hover:shadow-xs-txpink"
      }`}
      onClick={() => props.onClick()}
    >
      <div className="flex">
        <img src={props.metadata.icon} alt="wallet-logo" width={28} height={28} />
        <h3 className="text-xl font-medium tracking-wide ml-4">{props.metadata?.name}</h3>
      </div>
    </div>
  );
}
