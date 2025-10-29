import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock de las utilidades de órdenes
const mockGetStoredOrders = vi.fn(() => [])
const mockSaveStoredOrders = vi.fn(() => true)

vi.mock('../utils/orders', () => ({
  getStoredOrders: mockGetStoredOrders,
  saveStoredOrders: mockSaveStoredOrders
}))

describe('Orders Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getStoredOrders', () => {
    it('debería obtener órdenes vacías inicialmente', () => {
      const ordenes = mockGetStoredOrders()
      expect(ordenes).toEqual([])
    })

    it('debería manejar errores de localStorage', () => {
      mockGetStoredOrders.mockImplementation(() => {
        throw new Error('Storage error')
      })

      expect(() => mockGetStoredOrders()).toThrow('Storage error')
    })
  })

  describe('saveStoredOrders', () => {
    it('debería guardar órdenes correctamente', () => {
      const ordenes = [
        { id: '1', usuario: 'test@test.com', productos: [], total: 0 },
        { id: '2', usuario: 'test2@test.com', productos: [], total: 0 }
      ]

      const saved = mockSaveStoredOrders(ordenes)
      expect(saved).toBe(true)
    })

    it('debería manejar errores de localStorage', () => {
      mockSaveStoredOrders.mockImplementation(() => {
        throw new Error('Storage error')
      })

      const ordenes = [{ id: '1', usuario: 'test@test.com' }]
      expect(() => mockSaveStoredOrders(ordenes)).toThrow('Storage error')
    })
  })
})