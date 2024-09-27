"use client";

import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Providers } from "@/redux/provider.jsx";
import { sepolia } from "wagmi/chains";
import { withAuthGuard } from "@/hocs/with-auth-guard";

const WALLETCONNECT_PROJECT_ID = "99296b5d7acb2ca478909bd3e7b4f780";
const ALCHEMY_ID = "vpEAMGP_rB7ZhU43ybQC6agpdVToaV5S";

const config = createConfig(
    getDefaultConfig({
        alchemyId: ALCHEMY_ID,
        walletConnectProjectId: WALLETCONNECT_PROJECT_ID,
        appName: "Horsly",
        chains: [sepolia],
    })
);

const AuthLayout = withAuthGuard(({ children }) => <>{children}</>);

const MyProvider = ({ children }) => {
    return (
        <WagmiConfig config={config}>
            <ConnectKitProvider>
                <Providers>
                    <AuthLayout>{children}</AuthLayout>
                </Providers>
            </ConnectKitProvider>
        </WagmiConfig>
    );
};

export default MyProvider;
