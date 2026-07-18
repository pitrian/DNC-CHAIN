import type { AppProps } from 'next/app';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { arbitrumSepolia, hardhat } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import Layout from '../components/Layout';
import '../styles/globals.css';

const config = getDefaultConfig({
  appName: 'DNC-CertiTrust',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'bd3720a513eeaf9382a663b7139a3eac',
  chains: [hardhat, arbitrumSepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
