'use client'

import { useState } from 'react'
import { ErrorHandler, type ErrorInfo } from '@/lib/error-handler'

interface ErrorDisplayProps {
  error: string | Error | unknown
  onRetry?: () => void
  className?: string
}

export function ErrorDisplay({ error, onRetry, className = '' }: ErrorDisplayProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const errorInfo: ErrorInfo = ErrorHandler.handleError(error)
  const formattedMessage = ErrorHandler.formatErrorMessage(errorInfo)

  const handleRetry = async () => {
    if (!onRetry || isRetrying) return

    setIsRetrying(true)
    try {
      await onRetry()
    } finally {
      setIsRetrying(false)
    }
  }

  const getErrorIcon = () => {
    switch (errorInfo.type) {
      case 'network':
        return (
          <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      case 'validation':
        return (
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      case 'blockchain':
        return (
          <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const getBorderColor = () => {
    switch (errorInfo.type) {
      case 'network':
        return 'border-orange-200'
      case 'validation':
        return 'border-red-200'
      case 'blockchain':
        return 'border-purple-200'
      default:
        return 'border-red-200'
    }
  }

  const getBackgroundColor = () => {
    switch (errorInfo.type) {
      case 'network':
        return 'bg-orange-50'
      case 'validation':
        return 'bg-red-50'
      case 'blockchain':
        return 'bg-purple-50'
      default:
        return 'bg-red-50'
    }
  }

  const getTextColor = () => {
    switch (errorInfo.type) {
      case 'network':
        return 'text-orange-800'
      case 'validation':
        return 'text-red-800'
      case 'blockchain':
        return 'text-purple-800'
      default:
        return 'text-red-800'
    }
  }

  return (
    <div className={`w-full max-w-md mx-auto mt-8 ${className}`}>
      <div className={`border rounded-xl shadow-lg overflow-hidden ${getBorderColor()}`}>
        <div className={`px-6 py-4 ${getBackgroundColor()}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {getErrorIcon()}
            </div>
            <div className="ml-3 flex-1">
              <h3 className={`text-lg font-medium ${getTextColor()}`}>
                {errorInfo.type === 'network' && 'Problème de connexion'}
                {errorInfo.type === 'validation' && 'Données invalides'}
                {errorInfo.type === 'blockchain' && 'Erreur blockchain'}
                {errorInfo.type === 'server' && 'Erreur du serveur'}
                {errorInfo.type === 'unknown' && 'Erreur inattendue'}
              </h3>
              <p className={`text-sm mt-1 ${getTextColor().replace('800', '700')}`}>
                {formattedMessage}
              </p>
              {errorInfo.code && (
                <p className={`text-xs mt-2 font-mono ${getTextColor().replace('800', '600')}`}>
                  Code: {errorInfo.code}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {(errorInfo.retryable || onRetry) && (
          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <div className="flex space-x-3">
              {errorInfo.retryable && onRetry && (
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  {isRetrying ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Nouvelle tentative...
                    </div>
                  ) : (
                    'Réessayer'
                  )}
                </button>
              )}
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Actualiser la page
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Conseils de dépannage */}
      {errorInfo.type === 'network' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Conseils de dépannage :</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Vérifiez votre connexion internet</li>
            <li>• Essayez de rafraîchir la page</li>
            <li>• Vérifiez si le service est disponible</li>
          </ul>
        </div>
      )}

      {errorInfo.type === 'validation' && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Vérifiez vos données :</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• L'adresse doit commencer par "0x"</li>
            <li>• L'adresse doit faire exactement 42 caractères</li>
            <li>• Utilisez uniquement des caractères hexadécimaux (0-9, a-f)</li>
          </ul>
        </div>
      )}
    </div>
  )
}
