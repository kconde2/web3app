import { describe, it, expect, mock } from 'bun:test'
import { balanceRequestSchema, balanceFormSchema } from '@/lib/validation'

// Mock viem isAddress function
const mockIsAddress = mock(() => true)

// Mock the viem module
mock.module('viem', () => ({
  isAddress: mockIsAddress,
}))

describe('Validation Schemas', () => {
  describe('balanceRequestSchema', () => {
    it('should validate correct Ethereum address and chain', () => {
      mockIsAddress.mockImplementation(() => true)

      const validData = {
        address: '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97',
        chain: 'ethereum'
      }

      const result = balanceRequestSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate correct Mode address and chain', () => {
      mockIsAddress.mockImplementation(() => true)

      const validData = {
        address: '0x58c0179d43d2Ccb0459eb151F35CeB7eEdbB7FA4',
        chain: 'mode'
      }

      const result = balanceRequestSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid address', () => {
      mockIsAddress.mockImplementation(() => false)

      const invalidData = {
        address: 'invalid-address',
        chain: 'ethereum'
      }

      const result = balanceRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Adresse Ethereum invalide')
      }
    })

    it('should reject unsupported chain', () => {
      mockIsAddress.mockImplementation(() => true)

      const invalidData = {
        address: '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97',
        chain: 'bitcoin'
      }

      const result = balanceRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Chaîne non supportée')
      }
    })

    it('should reject empty address', () => {
      const invalidData = {
        address: '',
        chain: 'ethereum'
      }

      const result = balanceRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('L\'adresse est requise')
      }
    })
  })

  describe('balanceFormSchema', () => {
    it('should validate correct form data', () => {
      mockIsAddress.mockImplementation(() => true)

      const validData = {
        address: '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97',
        chain: 'ethereum'
      }

      const result = balanceFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject address without 0x prefix', () => {
      const invalidData = {
        address: '4838b106fce9647bdf1e7877bf73ce8b0bad5f97',
        chain: 'ethereum'
      }

      const result = balanceFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Format attendu: 0x')
      }
    })

    it('should trim whitespace from address', () => {
      mockIsAddress.mockImplementation(() => true)

      const dataWithWhitespace = {
        address: '  0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97  ',
        chain: 'ethereum'
      }

      const result = balanceFormSchema.safeParse(dataWithWhitespace)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.address).toBe('0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97')
      }
    })
  })
})
