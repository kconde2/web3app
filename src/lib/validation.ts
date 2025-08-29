import { z } from 'zod'
import { isAddress } from 'viem'
import { isSupportedChain } from './chains'

/**
 * Validation personnalisée pour les adresses Ethereum
 */
const ethereumAddressSchema = z
  .string()
  .min(1, 'L\'adresse est requise')
  .refine(
    (address) => isAddress(address),
    'Adresse Ethereum invalide. Doit commencer par 0x et faire 42 caractères.'
  )

/**
 * Validation pour les chaînes supportées
 */
const supportedChainSchema = z
  .string()
  .min(1, 'La chaîne est requise')
  .refine(
    (chain) => isSupportedChain(chain),
    'Chaîne non supportée. Choisissez entre Ethereum ou Mode.'
  )

/**
 * Schéma de validation pour les requêtes de solde
 */
export const balanceRequestSchema = z.object({
  address: ethereumAddressSchema,
  chain: supportedChainSchema,
})

/**
 * Schéma de validation pour le formulaire côté client
 */
export const balanceFormSchema = z.object({
  address: z
    .string()
    .min(1, 'L\'adresse est requise')
    .trim()
    .refine(
      (address) => {
        // Vérification basique du format
        if (!address.startsWith('0x')) {
          return false
        }
        if (address.length !== 42) {
          return false
        }
        // Vérification que ce sont des caractères hexadécimaux
        return /^0x[a-fA-F0-9]{40}$/.test(address)
      },
      {
        message: 'Adresse Ethereum invalide. Format attendu: 0x suivi de 40 caractères hexadécimaux.',
      }
    )
    .refine(
      (address) => isAddress(address),
      'Adresse Ethereum invalide selon la spécification EIP-55.'
    ),
  chain: supportedChainSchema,
})

/**
 * Types inférés des schémas
 */
export type BalanceRequestData = z.infer<typeof balanceRequestSchema>
export type BalanceFormData = z.infer<typeof balanceFormSchema>

/**
 * Utilitaires de validation
 */
export class ValidationUtils {
  /**
   * Valider une adresse Ethereum
   */
  static validateAddress(address: string): { isValid: boolean; error?: string } {
    try {
      ethereumAddressSchema.parse(address)
      return { isValid: true }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          error: error.errors[0]?.message || 'Adresse invalide'
        }
      }
      return { isValid: false, error: 'Erreur de validation' }
    }
  }

  /**
   * Valider une chaîne
   */
  static validateChain(chain: string): { isValid: boolean; error?: string } {
    try {
      supportedChainSchema.parse(chain)
      return { isValid: true }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          error: error.errors[0]?.message || 'Chaîne invalide'
        }
      }
      return { isValid: false, error: 'Erreur de validation' }
    }
  }

  /**
   * Valider les données complètes du formulaire
   */
  static validateBalanceForm(data: unknown): {
    isValid: boolean
    data?: BalanceFormData
    errors?: Record<string, string>
  } {
    try {
      const validData = balanceFormSchema.parse(data)
      return { isValid: true, data: validData }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0] as string] = err.message
          }
        })
        return { isValid: false, errors }
      }
      return { isValid: false, errors: { general: 'Erreur de validation' } }
    }
  }
}
