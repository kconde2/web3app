import { describe, it, expect } from 'bun:test'
import { ErrorHandler } from '@/lib/error-handler'

describe('ErrorHandler', () => {
  describe('handleError', () => {
    it('should handle Zod validation errors', () => {
      const zodError = {
        issues: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'number',
            path: ['address'],
            message: 'Expected string, received number'
          }
        ]
      }

      const result = ErrorHandler.handleError(zodError)

      expect(result.message).toBe('Données invalides')
      expect(result.code).toBe('VALIDATION_ERROR')
      expect(result.type).toBe('validation')
      expect(result.details).toBe('Veuillez vérifier les champs du formulaire')
      expect(result.retryable).toBe(false)
    })

    it('should handle network fetch errors', () => {
      const fetchError = new TypeError('fetch failed')

      const result = ErrorHandler.handleError(fetchError)

      expect(result.message).toBe('Erreur de connexion')
      expect(result.code).toBe('NETWORK_ERROR')
      expect(result.type).toBe('network')
      expect(result.details).toContain('Impossible de se connecter au serveur')
      expect(result.retryable).toBe(true)
    })

    it('should handle HTTP 400 errors', () => {
      const httpError = { status: 400 }

      const result = ErrorHandler.handleError(httpError)

      expect(result.message).toBe('Erreur de requête')
      expect(result.code).toBe('HTTP_400')
      expect(result.type).toBe('validation')
      expect(result.retryable).toBe(false)
    })

    it('should handle HTTP 500 errors', () => {
      const httpError = { status: 500 }

      const result = ErrorHandler.handleError(httpError)

      expect(result.message).toBe('Erreur du serveur')
      expect(result.code).toBe('HTTP_500')
      expect(result.type).toBe('server')
      expect(result.details).toContain('Le serveur rencontre des difficultés')
      expect(result.retryable).toBe(true)
    })

    it('should handle timeout errors', () => {
      const timeoutError = new Error('Request timeout after 15000ms')

      const result = ErrorHandler.handleError(timeoutError)

      expect(result.message).toBe('Délai d\'attente dépassé')
      expect(result.code).toBe('TIMEOUT_ERROR')
      expect(result.type).toBe('network')
      expect(result.details).toContain('La requête a pris trop de temps')
      expect(result.retryable).toBe(true)
    })
  })

  describe('formatErrorMessage', () => {
    it('should format error with details', () => {
      const errorInfo = {
        message: 'Test error',
        type: 'validation' as const,
        details: 'Additional details',
        retryable: true
      }

      const result = ErrorHandler.formatErrorMessage(errorInfo)
      expect(result).toBe('Test error Additional details Vous pouvez réessayer.')
    })

    it('should format error without details', () => {
      const errorInfo = {
        message: 'Test error',
        type: 'validation' as const,
        retryable: false
      }

      const result = ErrorHandler.formatErrorMessage(errorInfo)
      expect(result).toBe('Test error')
    })
  })

  describe('isRetryable', () => {
    it('should return true for retryable errors', () => {
      const networkError = new TypeError('fetch failed')
      const result = ErrorHandler.isRetryable(networkError)
      expect(result).toBe(true)
    })

    it('should return false for non-retryable errors', () => {
      const validationError = { issues: [] }
      const result = ErrorHandler.isRetryable(validationError)
      expect(result).toBe(false)
    })
  })
})
