import { formatEther } from 'viem'

/**
 * Utilitaires de formatage pour l'affichage
 */
export class Formatters {
  /**
   * Formater un solde en ETH avec un nombre approprié de décimales
   */
  static formatBalance(balance: bigint, maxDecimals: number = 6): string {
    const ethValue = formatEther(balance)
    const numValue = parseFloat(ethValue)

    // Si le solde est 0
    if (numValue === 0) {
      return '0'
    }

    // Si le solde est très petit, afficher en notation scientifique
    if (numValue < 0.000001) {
      return numValue.toExponential(2)
    }

    // Sinon, formater avec le nombre approprié de décimales
    return numValue.toFixed(maxDecimals).replace(/\.?0+$/, '')
  }

  /**
   * Formater un solde avec l'unité
   */
  static formatBalanceWithUnit(balance: bigint, symbol: string = 'ETH'): string {
    return `${this.formatBalance(balance)} ${symbol}`
  }

  /**
   * Formater une adresse pour l'affichage (raccourcie)
   */
  static formatAddress(address: string, startChars: number = 6, endChars: number = 4): string {
    if (address.length <= startChars + endChars) {
      return address
    }

    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
  }

  /**
   * Formater un nom de chaîne pour l'affichage
   */
  static formatChainName(chainName: string): string {
    return chainName.replace(/\b\w/g, l => l.toUpperCase())
  }

  /**
   * Formater un nombre avec des séparateurs de milliers
   */
  static formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num)
  }

  /**
   * Formater une valeur en USD (si on avait les prix)
   */
  static formatUSD(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  /**
   * Capitaliser la première lettre d'une chaîne
   */
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  /**
   * Formater un timestamp en date lisible
   */
  static formatDate(timestamp: number): string {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp))
  }
}
