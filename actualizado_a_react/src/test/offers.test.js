import { describe, it, expect, beforeEach, vi } from 'vitest'
import { calculateItemPricing } from '../utils/offers'

describe('Offers Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('calculateItemPricing', () => {
    it('debería calcular precio sin descuento', () => {
      const producto = {
        id: '1',
        nombre: 'Test Product',
        precio: 1000,
        categoria: 'test'
      }

      const result = calculateItemPricing(producto)
      
      expect(result).toBeDefined()
      expect(result.unitPrice).toBe(1000)
    })

    it('debería manejar producto sin precio', () => {
      const producto = {
        id: '1',
        nombre: 'Test Product',
        categoria: 'test'
      }

      const result = calculateItemPricing(producto)
      
      expect(result).toBeDefined()
      expect(result.unitPrice).toBe(0)
    })

    it('debería manejar producto con precio 0', () => {
      const producto = {
        id: '1',
        nombre: 'Test Product',
        precio: 0,
        categoria: 'test'
      }

      const result = calculateItemPricing(producto)
      
      expect(result).toBeDefined()
      expect(result.unitPrice).toBe(0)
    })

    it('debería retornar estructura correcta', () => {
      const producto = {
        id: '1',
        nombre: 'Test Product',
        precio: 1000,
        categoria: 'test'
      }

      const result = calculateItemPricing(producto)
      
      expect(result).toHaveProperty('unitPrice')
      expect(typeof result.unitPrice).toBe('number')
    })
  })
})