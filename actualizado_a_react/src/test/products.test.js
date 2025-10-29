import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getStoredProducts, saveStoredProducts, getMergedProducts } from '../utils/products'

describe('Products Utils', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('getStoredProducts', () => {
    it('debería obtener productos vacíos inicialmente', () => {
      const productos = getStoredProducts()
      expect(productos).toEqual([])
    })

    it('debería manejar errores de localStorage', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error')
      })

      const productos = getStoredProducts()
      expect(productos).toEqual([])
    })
  })

  describe('saveStoredProducts', () => {
    it('debería guardar productos correctamente', () => {
      const productos = [
        { id: '1', nombre: 'Product 1', precio: 1000 },
        { id: '2', nombre: 'Product 2', precio: 2000 }
      ]

      const saved = saveStoredProducts(productos)
      expect(saved).toBe(true)

      const retrieved = getStoredProducts()
      expect(retrieved).toEqual(productos)
    })

    it('debería manejar errores de localStorage', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error')
      })

      const productos = [{ id: '1', nombre: 'Test' }]
      const result = saveStoredProducts(productos)
      expect(result).toBe(false)
    })
  })

  describe('getMergedProducts', () => {
    it('debería ser una función async', () => {
      expect(typeof getMergedProducts).toBe('function')
    })

    it('debería retornar una promesa', () => {
      const result = getMergedProducts()
      expect(result).toBeInstanceOf(Promise)
    })
  })
})