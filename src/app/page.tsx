"use client";
import { Alchemy, AssetTransfersCategory, Network } from "alchemy-sdk";
import { useCallback, useEffect, useState } from "react";

interface Token {
  balance: number;
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  logo: string | null;
}

const ALCHEMY_API_KEY = "7HknkQpSn684KDD_yZhfIXIClgBpAPB2";
const RAINBOW_WALLET_ADDRESS = "elliotwood.eth";

// TODO: Transactions

export default function Home() {
  const config = {
    apiKey: ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);
  const [tokens, setTokens] = useState<Token[]>([]);

  const getBalances = useCallback(async () => {
    const { tokenBalances } = await alchemy.core.getTokenBalances(
      RAINBOW_WALLET_ADDRESS
    );

    const metadataPromises = tokenBalances.map(
      async ({ contractAddress, tokenBalance }, index) => {
        const metadata = await alchemy.core.getTokenMetadata(contractAddress);

        return {
          ...metadata,
          balance: tokenBalance / Math.pow(10, metadata.decimals)?.toFixed(2),
        };
      }
    );

    const tokenDetails = await Promise.all(metadataPromises);
    const nonZeroBalances = tokenDetails.filter(({ balance }) => balance !== 0);
    setTokens(nonZeroBalances);
  }, [alchemy.core]);

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

    console.log({ data });
  }, [alchemy.core]);

  useEffect(() => {
    getBalances();
    getTransactions();
  }, [getBalances, getTransactions]);

  return (
    <main>
      <ul>
        {tokens.map(({ name, balance, symbol }) => (
          <li key={symbol}>{`${name} (${symbol}): ${balance}`}</li>
        ))}
      </ul>
    </main>
  );
}
