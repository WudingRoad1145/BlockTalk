import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { WagmiConfig, createClient, goerli } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import MainPage from 'pages/main';
import { avalanche, avalancheFuji } from '@wagmi/core/chains'

const chains = [goerli, avalancheFuji];
const client = createClient(
  getDefaultClient({ appName: "BlockTalks", chains })
)
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="auto" mode="light">
        <MainPage />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
