"use client";
import {
  Alchemy,
  AssetTransfersCategory,
  Network,
  OwnedToken,
} from "alchemy-sdk";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useBalance } from "wagmi";

const ALCHEMY_API_KEY = "7HknkQpSn684KDD_yZhfIXIClgBpAPB2";
const RAINBOW_WALLET_ADDRESS = "0x475EFd9e4f63c50AEf1A66B985B6CC5AB4417C71";

// TODO: Transactions
// TODO: Loading skeletons
// TODO: API_KEY in env vars
// TODO: React Query

export default function App() {
  const config = {
    apiKey: ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);
  const [walletAddress, setWalletAddress] = useState<
    `0x${string}` | undefined
  >();
  const [tokens, setTokens] = useState<OwnedToken[]>([]);
  const [loading, setLoading] = useState(false);
  const { data } = useBalance({
    address: walletAddress,
  });
  // use Ankr SDK
  const getBalances = async () => {
    setLoading(true);

    try {
      const { tokens } = await alchemy.core.getTokensForOwner(
        walletAddress ?? ""
      );

      const nonZeroBalances = tokens.filter(
        ({ balance }) => balance && balance !== "0.0"
      );
      setTokens(nonZeroBalances);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const getTransactions = useCallback(async () => {
    // TODO: Understand params
    const data = await alchemy.core.getAssetTransfers({
      maxCount: 0x20,
      excludeZeroValue: true,
      fromAddress: RAINBOW_WALLET_ADDRESS,
      category: [
        AssetTransfersCategory.INTERNAL,
        AssetTransfersCategory.EXTERNAL,
        AssetTransfersCategory.ERC20,
        AssetTransfersCategory.ERC721,
        AssetTransfersCategory.ERC1155,
      ],
    });
  }, [alchemy.core]);

  return (
    <main className="flex flex-col gap-8 items-center justify-center">
      <div className="flex flex-col gap-2 items-center">
        <label
          htmlFor="input-group-1"
          className="block mb-2 text-sm font-medium text-slate-100"
        >
          Enter Your Ethereum Wallet Address
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            id="input-group-1"
            className="bg-gray-50 border border-gray-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder={RAINBOW_WALLET_ADDRESS}
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value as `0x${string}`)}
          />
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            disabled={loading}
            onClick={getBalances}
          >
            {loading ? (
              <>
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-200 animate-spin fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
        <button
          onClick={() => setWalletAddress(RAINBOW_WALLET_ADDRESS)}
          className="text-xs mt-2 text-slate-400 underline"
        >
          Want to use an example wallet address?
        </button>
      </div>

      <ul className="w-full max-w-md divide-y divide-gray-200">
        {tokens.map(({ name, balance, symbol, logo }) => (
          <li key={symbol} className="flex items-center py-3">
            <div className="flex items-center gap-2 flex-1">
              {logo ? (
                <Image
                  className="rounded-full"
                  src={logo ?? ""}
                  alt="Neil image"
                  height={32}
                  width={32}
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg bg-slate-500" />
              )}
              <div>
                <p className="text-sm font-medium text-slate-100 truncate">
                  {symbol}
                </p>
                <p className="text-sm text-slate-400 truncate">{name}</p>
              </div>
            </div>
            <p className="inline-flex items-center text-base text-gray-2 text-slate-100">
              {balance}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
