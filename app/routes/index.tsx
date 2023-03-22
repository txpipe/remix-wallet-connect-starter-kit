import { useCallback, useState } from "react";
import { CardWallet } from "~/fragments/card-wallet";
import { InformationCircleIcon } from "~/fragments/icons";
import { useListWallets } from "~/wallet-connector/hooks/listWallets";
import { enable, getBalance, getNetwork, getUsedAddresses, getUtxos } from "~/wallet-connector/wallets/api.client";
import type { WalletMetadata, WALLET_IDS } from "~/wallet-connector/wallets/base";

type State = {
  selectedWallet: string;
  enabledWallet?: WalletMetadata;
  enabledWalletState?: WalletState;
  loading: boolean;
  error: string;
};

type WalletState = {
  balance: string;
  network: string;
  addresses: string[];
  utxos: string[];
};

function AddressTableRow(props: { address: string }) {
  return (
    <tr className="bg-gray-900 hover:bg-gray-850 transition-all">
      <td className="text-sm px-6 py-3 truncate ...">{props.address}</td>
    </tr>
  );
}

function AddressesTable(props: { addresses: string[] }) {
  return (
    <table className="rounded-md overflow-hidden w-full">
      <thead className="border-b border-gray-950">
        <tr>
          <th
            className="bg-gray-900 py-3 px-6 text-sm text-left text-gray-400 font-normal"
            scope="col"
          >
            Addresses
          </th>
        </tr>
      </thead>
      <tbody>
        {props.addresses.map((x) => (
          <AddressTableRow key={x} address={x} />
        ))}
      </tbody>
    </table>
  );
}

function UtxoTableRow(props: { utxo: string }) {
  return (
    <tr className="bg-gray-900 hover:bg-gray-850 transition-all ">
      <td className="text-xs px-6 py-3">{props.utxo}</td>
    </tr>
  );
}

function UtxosTable(props: { utxos: string[] }) {
  return (
    <table className="rounded-md overflow-hidden w-full">
      <thead className="border-b border-gray-950">
        <tr>
          <th
            className="bg-gray-900 py-3 px-6 text-sm text-left text-gray-400 font-normal"
            scope="col"
          >
            UTXOs
          </th>
        </tr>
      </thead>
      <tbody>
        {props.utxos.map((x) => (
          <UtxoTableRow key={x} utxo={x} />
        ))}
      </tbody>
    </table>
  );
}

export default function Index() {
  const availableWallets = useListWallets();

  const [state, setState] = useState<State>({
    selectedWallet: "",
    enabledWallet: undefined,
    loading: false,
    error: "",
  });

  const mergeSpecs = useCallback((delta: Partial<State>) => {
    setState((prev: any) => ({ ...prev, ...delta }));
  }, []);

  const connectWallet = useCallback(
    async (walletId: WALLET_IDS) => {
      try {
        mergeSpecs({ loading: true, error: "" });
        const enabledWallet = await enable(walletId);

        const [balance, network, addresses, utxos] = await Promise.all([getBalance(), getNetwork(), getUsedAddresses(), getUtxos()]);

        mergeSpecs({
          loading: false,
          enabledWallet,
          enabledWalletState: {
            balance,
            network,
            addresses,
            utxos,
          },
        });
      } catch (error: any) {
        mergeSpecs({ loading: false, error: `An error ocurred while connecting your wallet: ${error.info || 'unknown'} ` });
      }
    },
    [mergeSpecs]
  );

  return (
    <div className="bg-gray-950 h-screen max-w-xxl">
      <div className="wrapper-full flex items-center pt-20 text-white">
        <div className="flex-1">
          {/* No wallet enabled  */}
          {!state.enabledWallet && (
            <>
              <div className="box-black flex items-center justify-between">
                <div>
                  <h2 className="title-md">Connect Wallet</h2>
                  <p className="text-base text-gray-200 mt-2">
                    Select a Wallet to connect from the list of wallets installed in your browser.
                  </p>
                </div>
                <button
                  className="btn-primary"
                  disabled={!state.selectedWallet || state.loading}
                  onClick={() => connectWallet(state.selectedWallet as WALLET_IDS)}
                >
                  Connect
                </button>
              </div>{" "}
              <div className="mt-8">
                {availableWallets.length ? (
                  <div className="grid gap-4 grid-cols-1">
                    {availableWallets.map((wallet: WalletMetadata) => (
                      <CardWallet
                        key={wallet.id}
                        metadata={wallet}
                        selected={wallet.id === state.selectedWallet}
                        onClick={() => mergeSpecs({ selectedWallet: wallet.id })}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="box-black mt-4">
                    <div className="flex items-center">
                      <InformationCircleIcon className="w-8 h-8 flex-none" />
                      <h2 className="title-md ml-3">No Wallets were found.</h2>
                    </div>
                    <p className="text-gray-200 mt-3">
                      You need to install one of the Cardano wallet extensions in order to use this feature.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {state.enabledWallet && (
            <>
              <div className="box-black flex items-center justify-between">
                <div>
                  <h2 className="title-md">Wallet Connected</h2>
                  <p className="text-base text-gray-200 mt-2">You have successfully connected your wallet!</p>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => mergeSpecs({ selectedWallet: "", enabledWallet: undefined })}
                >
                  Disconnect
                </button>
              </div>{" "}
              <div className="box-black mt-4">
                <div className="flex">
                <img src={state.enabledWallet.icon} alt="wallet-logo" width={28} height={28} />
                <h3 className="text-xl font-medium tracking-wide ml-4">{state.enabledWallet.name}</h3>
              </div>
                <p className="text-txblue  mt-4">
                  Balance: <span className="text-white">{` ₳ ${parseInt((parseInt(state.enabledWalletState?.balance!, 10) / 1_000_000).toString(), 10)}.${state.enabledWalletState?.balance.substring(state.enabledWalletState?.balance.length - 6)}`}</span>
                </p>
                <p className="text-txblue mt-2">
                  Network: <span className="text-white">{state.enabledWalletState?.network}</span>
                </p>
              </div>

              <div className="mt-4">
                <AddressesTable addresses={state.enabledWalletState?.addresses || []}/>
              </div>

              <div className="mt-4">
                <UtxosTable utxos={state.enabledWalletState?.utxos || []}/>
              </div>
              
            </>
          )}
          {state.error && (
            <>
              <div className="box-red mt-8">
                <p className="text-red-500">{state.error}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
