import { createPublicClient, http, erc20Abi } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const;

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export async function getUsdcBalance(): Promise<number> {
  const privateKey = process.env.WALLET_PRIVATE_KEY as `0x${string}`;
  const account = privateKeyToAccount(privateKey);

  const raw = await publicClient.readContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account.address],
  });

  return Number(raw) / 1_000_000;
}
