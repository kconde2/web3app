import { createPublicClient, http, type PublicClient } from 'viem'
import { SUPPORTED_CHAINS, type SupportedChain } from './chains'

/**
 * Cache des clients viem pour éviter les re-créations
 */
const clientCache = new Map<SupportedChain, PublicClient>()

/**
 * Créer un client viem pour une chaîne donnée
 */
export function createChainClient(chainId: SupportedChain): PublicClient {
  // Vérifier le cache d'abord
  if (clientCache.has(chainId)) {
    return clientCache.get(chainId)!
  }

  const chainConfig = SUPPORTED_CHAINS[chainId]

  const client = createPublicClient({
    chain: chainConfig.chain,
    transport: http(),
  })

  // Mettre en cache le client
  clientCache.set(chainId, client)

  return client
}

/**
 * Obtenir le client pour Ethereum Mainnet
 */
export function getEthereumClient(): PublicClient {
  return createChainClient('ethereum')
}

/**
 * Obtenir le client pour Mode Mainnet
 */
export function getModeClient(): PublicClient {
  return createChainClient('mode')
}

/**
 * Obtenir un client par identifiant de chaîne
 */
export function getClientByChain(chainId: SupportedChain): PublicClient {
  return createChainClient(chainId)
}

/**
 * Nettoyer le cache des clients (utile pour les tests)
 */
export function clearClientCache(): void {
  clientCache.clear()
}
