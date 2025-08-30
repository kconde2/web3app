'use client'

import { useState } from 'react'
import type { BalanceResult } from '@/types/blockchain'
import { Formatters } from '@/lib/formatters'

interface BalanceResultProps {
  result: BalanceResult
}

export function BalanceResult({ result }: BalanceResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(result.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erreur lors de la copie:', error)
    }
  }

  const handleOpenExplorer = () => {
    const explorerUrl = `${result.explorer}/address/${result.address}`
    window.open(explorerUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        {/* En-tête avec succès */}
        <div className="bg-green-50 border-b border-green-200 px-6 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-800">Solde récupéré avec succès</h3>
              <p className="text-sm text-green-600">Informations à jour de la blockchain</p>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="px-6 py-6 space-y-6">
          {/* Solde principal */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {Formatters.formatBalance(BigInt(result.balance))}
            </div>
            <div className="text-lg text-gray-600">
              {result.symbol}
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="space-y-4">
            {/* Chaîne */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Chaîne</span>
              <span className="text-sm text-gray-900 font-medium">{result.chainName}</span>
            </div>

            {/* Adresse */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Adresse</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-900 font-mono">
                  {Formatters.formatAddress(result.address)}
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copier l'adresse"
                >
                  {copied ? (
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Solde brut */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Solde brut (Wei)</span>
              <span className="text-sm text-gray-900 font-mono break-all text-right max-w-48">
                {result.balance}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleOpenExplorer}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Voir sur l'explorateur
            </button>
            <button
              onClick={handleCopyAddress}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              {copied ? 'Copié !' : 'Copier l\'adresse'}
            </button>
          </div>
        </div>
      </div>

      {/* Informations supplémentaires */}
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>Les données sont récupérées directement depuis la blockchain</p>
        <p>Dernière mise à jour : {Formatters.formatDate(Date.now())}</p>
      </div>
    </div>
  )
}
