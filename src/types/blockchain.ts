import { type Address } from 'viem'
import { type SupportedChain } from '@/lib/chains'

/**
 * Paramètres pour récupérer un solde
 */
export interface BalanceRequest {
  address: Address
  chain: SupportedChain
}

/**
 * Réponse de l'API de solde
 */
export interface BalanceResponse {
  success: boolean
  data?: {
    address: Address
    chain: SupportedChain
    chainName: string
    balance: string
    balanceFormatted: string
    symbol: string
    explorer: string
  }
  error?: {
    message: string
    code?: string
  }
}

/**
 * Erreurs spécifiques à l'application
 */
export class InvalidAddressError extends Error {
  constructor(address: string) {
    super(`Adresse Ethereum invalide: ${address}`)
    this.name = 'InvalidAddressError'
  }
}

export class UnsupportedChainError extends Error {
  constructor(chain: string) {
    super(`Chaîne non supportée: ${chain}`)
    this.name = 'UnsupportedChainError'
  }
}

export class BalanceFetchError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(`Erreur lors de la récupération du solde: ${message}`)
    this.name = 'BalanceFetchError'
  }
}

/**
 * Types pour les formulaires
 */
export interface BalanceFormData {
  address: string
  chain: SupportedChain
}

/**
 * États de l'interface utilisateur
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * Résultat affiché dans l'interface
 */
export interface BalanceResult {
  address: Address
  chain: SupportedChain
  chainName: string
  balance: string
  balanceFormatted: string
  symbol: string
  explorer: string
}
