import { NextRequest, NextResponse } from 'next/server'
import { isAddress, formatEther } from 'viem'
import { getClientByChain } from '@/lib/viem-clients'
import { isSupportedChain, getChainConfig } from '@/lib/chains'
import type { BalanceResponse, BalanceRequest } from '@/types/blockchain'

/**
 * Endpoint API pour récupérer le solde d'une adresse
 * POST /api/balance
 */
export async function POST(request: NextRequest) {
  try {
    // Parser le body de la requête
    const body: BalanceRequest = await request.json()
    const { address, chain } = body

    // Validation des paramètres
    if (!address || !chain) {
      return NextResponse.json<BalanceResponse>(
        {
          success: false,
          error: {
            message: 'Adresse et chaîne sont requis',
            code: 'MISSING_PARAMETERS',
          },
        },
        { status: 400 }
      )
    }

    // Validation de l'adresse Ethereum
    if (!isAddress(address)) {
      return NextResponse.json<BalanceResponse>(
        {
          success: false,
          error: {
            message: 'Adresse Ethereum invalide',
            code: 'INVALID_ADDRESS',
          },
        },
        { status: 400 }
      )
    }

    // Validation de la chaîne
    if (!isSupportedChain(chain)) {
      return NextResponse.json<BalanceResponse>(
        {
          success: false,
          error: {
            message: `Chaîne non supportée: ${chain}`,
            code: 'UNSUPPORTED_CHAIN',
          },
        },
        { status: 400 }
      )
    }

    // Récupération du client et de la configuration de la chaîne
    const client = getClientByChain(chain)
    const chainConfig = getChainConfig(chain)

    // Récupération du solde avec timeout de 15 secondes
    const balance = await Promise.race([
      client.getBalance({ address }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout: La requête a pris trop de temps')), 15000)
      )
    ])

    // Formatage du solde
    const balanceFormatted = formatEther(balance)

    // Réponse de succès
    return NextResponse.json<BalanceResponse>({
      success: true,
      data: {
        address,
        chain,
        chainName: chainConfig.name,
        balance: balance.toString(),
        balanceFormatted,
        symbol: chainConfig.symbol,
        explorer: chainConfig.explorer,
      },
    })

  } catch (error) {
    console.error('Erreur lors de la récupération du solde:', error)

    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      return NextResponse.json<BalanceResponse>(
        {
          success: false,
          error: {
            message: error.message,
            code: 'FETCH_ERROR',
          },
        },
        { status: 500 }
      )
    }

    // Erreur générique
    return NextResponse.json<BalanceResponse>(
      {
        success: false,
        error: {
          message: 'Erreur interne du serveur',
          code: 'INTERNAL_ERROR',
        },
      },
      { status: 500 }
    )
  }
}
