/**
 * Gestionnaire d'erreurs centralisé pour l'application
 */

export interface ErrorInfo {
  message: string
  code?: string
  type: 'validation' | 'network' | 'blockchain' | 'server' | 'unknown'
  details?: string
  retryable?: boolean
}

/**
 * Classe pour gérer les erreurs de l'application
 */
export class ErrorHandler {
  /**
   * Analyser et formater une erreur
   */
  static handleError(error: unknown): ErrorInfo {
    // Erreur de validation Zod
    if (error && typeof error === 'object' && 'issues' in error) {
      return {
        message: 'Données invalides',
        code: 'VALIDATION_ERROR',
        type: 'validation',
        details: 'Veuillez vérifier les champs du formulaire',
        retryable: false,
      }
    }

    // Erreur de réseau
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        message: 'Erreur de connexion',
        code: 'NETWORK_ERROR',
        type: 'network',
        details: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
        retryable: true,
      }
    }

    // Erreur HTTP
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as any).status

      if (status >= 400 && status < 500) {
        return {
          message: 'Erreur de requête',
          code: `HTTP_${status}`,
          type: 'validation',
          details: this.getHttpErrorMessage(status),
          retryable: false,
        }
      }

      if (status >= 500) {
        return {
          message: 'Erreur du serveur',
          code: `HTTP_${status}`,
          type: 'server',
          details: 'Le serveur rencontre des difficultés. Veuillez réessayer plus tard.',
          retryable: true,
        }
      }
    }

    // Erreur de timeout
    if (error instanceof Error && error.message.includes('timeout')) {
      return {
        message: 'Délai d\'attente dépassé',
        code: 'TIMEOUT_ERROR',
        type: 'network',
        details: 'La requête a pris trop de temps. Veuillez réessayer.',
        retryable: true,
      }
    }

    // Erreur blockchain spécifique
    if (error instanceof Error) {
      if (error.message.includes('insufficient funds')) {
        return {
          message: 'Fonds insuffisants',
          code: 'INSUFFICIENT_FUNDS',
          type: 'blockchain',
          details: 'L\'adresse n\'a pas suffisamment de fonds pour cette opération.',
          retryable: false,
        }
      }

      if (error.message.includes('invalid address')) {
        return {
          message: 'Adresse invalide',
          code: 'INVALID_ADDRESS',
          type: 'validation',
          details: 'L\'adresse Ethereum fournie n\'est pas valide.',
          retryable: false,
        }
      }

      if (error.message.includes('network')) {
        return {
          message: 'Erreur de réseau blockchain',
          code: 'BLOCKCHAIN_NETWORK_ERROR',
          type: 'blockchain',
          details: 'Impossible de se connecter à la blockchain. Veuillez réessayer.',
          retryable: true,
        }
      }

      // Erreur générique avec message
      return {
        message: error.message,
        code: 'GENERIC_ERROR',
        type: 'unknown',
        details: 'Une erreur inattendue s\'est produite.',
        retryable: true,
      }
    }

    // Erreur inconnue
    return {
      message: 'Erreur inconnue',
      code: 'UNKNOWN_ERROR',
      type: 'unknown',
      details: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
      retryable: true,
    }
  }

  /**
   * Obtenir un message d'erreur HTTP lisible
   */
  private static getHttpErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Requête invalide. Vérifiez les données saisies.'
      case 401:
        return 'Non autorisé. Authentification requise.'
      case 403:
        return 'Accès interdit.'
      case 404:
        return 'Ressource non trouvée.'
      case 429:
        return 'Trop de requêtes. Veuillez patienter avant de réessayer.'
      case 500:
        return 'Erreur interne du serveur.'
      case 502:
        return 'Passerelle incorrecte.'
      case 503:
        return 'Service temporairement indisponible.'
      case 504:
        return 'Délai d\'attente de la passerelle dépassé.'
      default:
        return `Erreur HTTP ${status}.`
    }
  }

  /**
   * Formater un message d'erreur pour l'affichage
   */
  static formatErrorMessage(errorInfo: ErrorInfo): string {
    let message = errorInfo.message

    if (errorInfo.details) {
      message += ` ${errorInfo.details}`
    }

    if (errorInfo.retryable) {
      message += ' Vous pouvez réessayer.'
    }

    return message
  }

  /**
   * Déterminer si une erreur est récupérable
   */
  static isRetryable(error: unknown): boolean {
    const errorInfo = this.handleError(error)
    return errorInfo.retryable ?? false
  }

  /**
   * Logger une erreur (pour le développement)
   */
  static logError(error: unknown, context?: string): void {
    const errorInfo = this.handleError(error)

    console.error('Error occurred:', {
      context,
      errorInfo,
      originalError: error,
      timestamp: new Date().toISOString(),
    })
  }
}
