import type { AppProps } from 'next/app';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { defineChain } from 'viem';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
  RainbowKitProvider,
  getDefaultConfig,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { Toaster } from 'react-hot-toast';
import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';

const anvilLocal = /*#__PURE__*/ defineChain({
  id: 31337,
  name: 'Anvil Local',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
});

const projectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
  'bd3720a513eeaf9382a663b7139a3eac';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, walletConnectWallet],
    },
  ],
  { appName: 'DNC-CertiTrust', projectId },
);

const config = createConfig({
  connectors,
  chains: [anvilLocal, arbitrumSepolia],
  transports: {
    [anvilLocal.id]: http('http://127.0.0.1:8545'),
    [arbitrumSepolia.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#1e293b' },
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#1e293b' },
              },
            }}
          />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
