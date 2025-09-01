import { describe, it, expect, mock } from 'bun:test'
import { BalanceService } from '@/lib/balance-service'
import { InvalidAddressError, UnsupportedChainError, BalanceFetchError } from '@/types/blockchain'

// Mock viem
const mockIsAddress = mock(() => true)
const mockGetBalance = mock(() => Promise.resolve(1000000000000000000n))
const mockGetClientByChain = mock(() => ({
  getBalance: mockGetBalance
}))

mock.module('viem', () => ({
  isAddress: mockIsAddress,
}))

mock.module('@/lib/viem-clients', () => ({
  getClientByChain: mockGetClientByChain,
}))

describe('BalanceService', () => {
  describe('getBalance', () => {
    it('should return balance for valid Ethereum address', async () => {
      // Arrange
      const testAddress = '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97'
      const testChain = 'ethereum'
      const mockBalance = 1000000000000000000n

      mockIsAddress.mockImplementation(() => true)
      mockGetBalance.mockImplementation(() => Promise.resolve(mockBalance))

      // Act
      const result = await BalanceService.getBalance(testAddress, testChain)

      // Assert
      expect(result.balance).toBeDefined()
      expect(result.address).toBe(testAddress)
      expect(result.chain).toBe(testChain)
      expect(result).toBeDefined()
    })

    it('should return balance for valid Mode address', async () => {
      // Arrange
      const testAddress = '0x58c0179d43d2Ccb0459eb151F35CeB7eEdbB7FA4'
      const testChain = 'mode'
      const mockBalance = 42000000000000000n

      mockIsAddress.mockImplementation(() => true)
      mockGetBalance.mockImplementation(() => Promise.resolve(mockBalance))

      // Act
      const result = await BalanceService.getBalance(testAddress, testChain)

      // Assert
      expect(result.balance).toBeDefined()
      expect(result.address).toBe(testAddress)
      expect(result.chain).toBe(testChain)
      expect(result).toBeDefined()
    })

    it('should throw InvalidAddressError for invalid address', async () => {
      // Arrange
      const invalidAddress = 'invalid-address'
      const testChain = 'ethereum'
      mockIsAddress.mockImplementation(() => false)

      // Act & Assert
      await expect(
        BalanceService.getBalance(invalidAddress, testChain)
      ).rejects.toThrow(InvalidAddressError)
    })

    it('should throw UnsupportedChainError for unsupported chain', async () => {
      // Arrange
      const testAddress = '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97'
      const unsupportedChain = 'bitcoin' as any
      mockIsAddress.mockImplementation(() => true)

      // Act & Assert
      await expect(
        BalanceService.getBalance(testAddress, unsupportedChain)
      ).rejects.toThrow(UnsupportedChainError)
    })

    it('should return zero balance for address with no funds', async () => {
      // Arrange
      const emptyAddress = '0x0000000000000000000000000000000000000000'
      const testChain = 'ethereum'
      const zeroBalance = 0n

      mockIsAddress.mockImplementation(() => true)
      mockGetBalance.mockImplementation(() => Promise.resolve(zeroBalance))

      // Act
      const result = await BalanceService.getBalance(emptyAddress, testChain)

      // Assert
      expect(result.balance).toBeDefined()
      expect(result.address).toBe(emptyAddress)
      expect(result.chain).toBe(testChain)
    })

    it('should handle very large balances', async () => {
      // Arrange
      const testAddress = '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97'
      const testChain = 'ethereum'
      const largeBalance = 1000000000000000000000000n // 1M ETH

      mockIsAddress.mockImplementation(() => true)
      mockGetBalance.mockImplementation(() => Promise.resolve(largeBalance))

      // Act
      const result = await BalanceService.getBalance(testAddress, testChain)

      // Assert
      expect(result.balance).toBeDefined()
    })

    it('should include correct timestamp', async () => {
      // Arrange
      const testAddress = '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97'
      const testChain = 'ethereum'
      const mockBalance = 1000000000000000000n

      mockIsAddress.mockImplementation(() => true)
      mockGetBalance.mockImplementation(() => Promise.resolve(mockBalance))

      // Act
      const result = await BalanceService.getBalance(testAddress, testChain)

      // Assert
      expect(result).toBeDefined()
      expect(result.address).toBe(testAddress)
    })

    it('should handle network errors gracefully', async () => {
      // Arrange
      const testAddress = '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97'
      const testChain = 'ethereum'
      const networkError = new Error('Network error')

      mockIsAddress.mockImplementation(() => true)
      mockGetBalance.mockImplementation(() => Promise.reject(networkError))

      // Act & Assert
      await expect(
        BalanceService.getBalance(testAddress, testChain)
      ).rejects.toThrow(BalanceFetchError)
    })
  })
})
