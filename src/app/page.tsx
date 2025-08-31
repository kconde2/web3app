'use client'

import { useState } from 'react'
import { BalanceForm } from '@/components/BalanceForm'
import { BalanceResult } from '@/components/BalanceResult'
import { LoadingState } from '@/components/LoadingSpinner'
import type { BalanceFormData, BalanceResult as BalanceResultType, LoadingState as LoadingStateType, BalanceResponse } from '@/types/blockchain'

export default function Home() {
  const [loading, setLoading] = useState<LoadingStateType>('idle')
  const [result, setResult] = useState<BalanceResultType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: BalanceFormData) => {
    setLoading('loading')
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData: BalanceResponse = await response.json()

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.error?.message || 'Erreur lors de la récupération du solde')
      }

      if (responseData.data) {
        setResult(responseData.data)
        setLoading('success')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite'
      setError(errorMessage)
      setLoading('error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Vérificateur de Solde Web3
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Consultez instantanément le solde d'une adresse Ethereum sur Ethereum Mainnet et Mode Mainnet
          </p>
        </header>

        {/* Contenu principal */}
        <main className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Formulaire */}
            <div className="lg:sticky lg:top-8">
              <BalanceForm
                onSubmit={handleSubmit}
                loading={loading}
                result={result}
                error={error}
              />
            </div>

            {/* Résultats */}
            <div className="lg:pl-8">
              {loading === 'loading' && <LoadingState />}
              {loading === 'success' && result && <BalanceResult result={result} />}
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Rapide et Fiable</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Récupération instantanée des soldes directement depuis les nœuds blockchain officiels.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Sécurisé</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Aucune connexion de portefeuille requise. Consultation en lecture seule uniquement.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Multi-chaînes</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Support d'Ethereum Mainnet et Mode Mainnet avec possibilité d'extension.
              </p>
            </div>
          </div>
        </main>

        {/* Pied de page */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            Développé avec Next.js, Viem et Tailwind CSS •
            <a href="https://github.com" className="text-blue-600 hover:underline ml-1">
              Code source
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
