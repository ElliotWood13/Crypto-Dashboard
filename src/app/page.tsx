"use client";
import {
  Alchemy,
  AssetTransfersCategory,
  Network,
  OwnedToken,
  TokenBalanceType,
} from "alchemy-sdk";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const ALCHEMY_API_KEY = "7HknkQpSn684KDD_yZhfIXIClgBpAPB2";
const RAINBOW_WALLET_ADDRESS = "elliotwood.eth";

// TODO: Transactions
// TODO: Loading skeletons
// TODO: API_KEY in env vars
// TODO: React Query

export default function Home() {
  const config = {
    apiKey: ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);
  const [walletAddress, setWalletAddress] = useState("");
  const [tokens, setTokens] = useState<OwnedToken[]>([]);

  const getBalances = async () => {
    const { tokens } = await alchemy.core.getTokensForOwner(walletAddress);

    const nonZeroBalances = tokens.filter(
      ({ balance }) => balance && balance !== "0.0"
    );
    setTokens(nonZeroBalances);
    console.log({ nonZeroBalances });
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
          Enter Your Wallet Address
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            id="input-group-1"
            className="bg-gray-50 border border-gray-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder={RAINBOW_WALLET_ADDRESS}
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={getBalances}
          >
            Submit
          </button>
        </div>
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
