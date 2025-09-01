import { describe, it, expect } from 'bun:test'
import { Formatters } from '@/lib/formatters'

describe('Formatters', () => {
  describe('formatAddress', () => {
    it('should format long address with default parameters', () => {
      const address = '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97'
      const result = Formatters.formatAddress(address)
      expect(result).toBe('0x4838...5f97')
    })

    it('should format address with custom parameters', () => {
      const address = '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97'
      const result = Formatters.formatAddress(address, 8, 6)
      expect(result).toContain('0x4838')
      expect(result).toContain('...')
    })

    it('should return formatted address for short addresses', () => {
      const shortAddress = '0x123456'
      const result = Formatters.formatAddress(shortAddress)
      expect(result).toContain('0x')
    })
  })

  describe('formatChainName', () => {
    it('should capitalize chain name', () => {
      const result = Formatters.formatChainName('ethereum mainnet')
      expect(result).toContain('Ethereum')
    })

    it('should handle single word', () => {
      const result = Formatters.formatChainName('mode')
      expect(result).toBe('Mode')
    })
  })

  describe('formatNumber', () => {
    it('should format number with French locale', () => {
      const result = Formatters.formatNumber(1234567.89)
      expect(result).toContain('234')
      expect(result).toContain('567')
    })

    it('should handle zero', () => {
      const result = Formatters.formatNumber(0)
      expect(result).toBe('0')
    })
  })

  describe('formatChainName (capitalize)', () => {
    it('should capitalize first letter', () => {
      const result = Formatters.formatChainName('hello world')
      expect(result).toBe('Hello world')
    })

    it('should handle empty string', () => {
      const result = Formatters.formatChainName('')
      expect(result).toBe('')
    })
  })

  describe('formatDate', () => {
    it('should format timestamp to date string', () => {
      const timestamp = new Date('2024-08-28T09:15:23Z').getTime()
      const result = Formatters.formatDate(timestamp)

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })
})
