import { defineChain } from 'viem'
import { mainnet } from 'viem/chains'

/**
 * Configuration pour Mode Mainnet
 * Mode est une Layer 2 optimiste sur Ethereum
 */
export const modeMainnet = defineChain({
  id: 34443,
  name: 'Mode Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.mode.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mode Explorer',
      url: 'https://explorer.mode.network',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 5022,
    },
  },
})

/**
 * Types pour les chaînes supportées
 */
export type SupportedChain = 'ethereum' | 'mode'

/**
 * Configuration des chaînes supportées
 */
export const SUPPORTED_CHAINS = {
  ethereum: {
    chain: mainnet,
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
  },
  mode: {
    chain: modeMainnet,
    name: 'Mode Mainnet',
    symbol: 'ETH',
    explorer: 'https://explorer.mode.network',
  },
} as const

/**
 * Obtenir la configuration d'une chaîne par son identifiant
 */
export function getChainConfig(chainId: SupportedChain) {
  return SUPPORTED_CHAINS[chainId]
}

/**
 * Vérifier si une chaîne est supportée
 */
export function isSupportedChain(chainId: string): chainId is SupportedChain {
  return chainId in SUPPORTED_CHAINS
}

/**
 * Liste des chaînes pour le sélecteur UI
 */
export const CHAIN_OPTIONS = [
  { value: 'ethereum', label: 'Ethereum Mainnet' },
  { value: 'mode', label: 'Mode Mainnet' },
] as const
