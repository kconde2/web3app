'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { balanceFormSchema, type BalanceFormData } from '@/lib/validation'
import { CHAIN_OPTIONS } from '@/lib/chains'
import type { BalanceResult, LoadingState } from '@/types/blockchain'

interface BalanceFormProps {
  onSubmit: (data: BalanceFormData) => Promise<void>
  loading: LoadingState
  result?: BalanceResult | null
  error?: string | null
}

export function BalanceForm({ onSubmit, loading, result, error }: BalanceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<BalanceFormData>({
    resolver: zodResolver(balanceFormSchema),
    mode: 'onChange',
    defaultValues: {
      chain: 'ethereum',
    },
  })

  const watchedAddress = watch('address')

  const handleFormSubmit = async (data: BalanceFormData) => {
    await onSubmit(data)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Titre */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vérificateur de Solde Web3
          </h1>
          <p className="text-gray-600">
            Consultez le solde d'une adresse Ethereum sur différentes chaînes
          </p>
        </div>

        {/* Champ d'adresse */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse Ethereum
          </label>
          <input
            {...register('address')}
            type="text"
            id="address"
            placeholder="0x..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.address
                ? 'border-red-500 bg-red-50'
                : watchedAddress && !errors.address
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300'
            }`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
          {watchedAddress && !errors.address && (
            <p className="mt-1 text-sm text-green-600">✓ Adresse valide</p>
          )}
        </div>

        {/* Sélecteur de chaîne */}
        <div>
          <label htmlFor="chain" className="block text-sm font-medium text-gray-700 mb-2">
            Chaîne blockchain
          </label>
          <select
            {...register('chain')}
            id="chain"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
          >
            {CHAIN_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.chain && (
            <p className="mt-1 text-sm text-red-600">{errors.chain.message}</p>
          )}
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={!isValid || loading === 'loading'}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            !isValid || loading === 'loading'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {loading === 'loading' ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Récupération en cours...
            </div>
          ) : (
            'Vérifier le solde'
          )}
        </button>

        {/* Affichage des erreurs */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
