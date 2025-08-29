import { isAddress, formatEther, type Address } from 'viem'
import { getClientByChain } from './viem-clients'
import { isSupportedChain, getChainConfig, type SupportedChain } from './chains'
import {
  InvalidAddressError,
  UnsupportedChainError,
  BalanceFetchError,
  type BalanceResult
} from '@/types/blockchain'

/**
 * Service pour récupérer les soldes d'adresses
 */
export class BalanceService {
  /**
   * Récupérer le solde d'une adresse sur une chaîne donnée
   */
  static async getBalance(
    address: string,
    chain: string
  ): Promise<BalanceResult> {
    // Validation de l'adresse
    if (!isAddress(address)) {
      throw new InvalidAddressError(address)
    }

    // Validation de la chaîne
    if (!isSupportedChain(chain)) {
      throw new UnsupportedChainError(chain)
    }

    try {
      // Récupération du client et de la configuration
      const client = getClientByChain(chain)
      const chainConfig = getChainConfig(chain)

      // Récupération du solde avec timeout
      const balance = await Promise.race([
        client.getBalance({ address: address as Address }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        )
      ])

      // Formatage du résultat
      return {
        address: address as Address,
        chain,
        chainName: chainConfig.name,
        balance: balance.toString(),
        balanceFormatted: formatEther(balance),
        symbol: chainConfig.symbol,
        explorer: chainConfig.explorer,
      }

    } catch (error) {
      if (error instanceof Error) {
        throw new BalanceFetchError(error.message, error)
      }
      throw new BalanceFetchError('Erreur inconnue lors de la récupération du solde')
    }
  }

  /**
   * Valider une adresse Ethereum
   */
  static isValidAddress(address: string): boolean {
    return isAddress(address)
  }

  /**
   * Valider une chaîne supportée
   */
  static isSupportedChain(chain: string): chain is SupportedChain {
    return isSupportedChain(chain)
  }

  /**
   * Formater un solde en ETH
   */
  static formatBalance(balance: bigint): string {
    return formatEther(balance)
  }

  /**
   * Obtenir l'URL de l'explorateur pour une adresse
   */
  static getExplorerUrl(address: Address, chain: SupportedChain): string {
    const chainConfig = getChainConfig(chain)
    return `${chainConfig.explorer}/address/${address}`
  }
}
