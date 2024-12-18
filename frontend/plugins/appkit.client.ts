import { arbitrum, base, baseSepolia, mainnet, solana, solanaDevnet, solanaTestnet, polygon, polygonMumbai, arbitrumSepolia, sepolia, goerli } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

import { WagmiPlugin } from '@wagmi/vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {


    const projectId = "0a8bf20f7564bfcf7e1c57fc68232edd"
    if (!projectId) {
        throw new Error('VITE_PROJECT_ID is not set')
    }

    const wagmiAdapter = new WagmiAdapter({
        networks: [mainnet, sepolia, base, baseSepolia],
        projectId
    })



    const vue = nuxtApp.vueApp;
    const queryClient = new QueryClient()

    vue.use(WagmiPlugin, { config: wagmiAdapter.wagmiConfig })
    vue.use(VueQueryPlugin, {queryClient})




})