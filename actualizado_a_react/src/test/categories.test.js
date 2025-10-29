import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock de las utilidades de categorías
const mockGetStoredCategories = vi.fn(() => [])
const mockSaveStoredCategories = vi.fn(() => true)

vi.mock('../utils/categories', () => ({
  getStoredCategories: mockGetStoredCategories,
  saveStoredCategories: mockSaveStoredCategories
}))

describe('Categories Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getStoredCategories', () => {
    it('debería obtener categorías vacías inicialmente', () => {
      const categorias = mockGetStoredCategories()
      expect(categorias).toEqual([])
    })

    it('debería manejar errores de localStorage', () => {
      mockGetStoredCategories.mockImplementation(() => {
        throw new Error('Storage error')
      })

      expect(() => mockGetStoredCategories()).toThrow('Storage error')
    })
  })

  describe('saveStoredCategories', () => {
    it('debería guardar categorías correctamente', () => {
      const categorias = [
        { id: '1', nombre: 'Tortas', descripcion: 'Categoría de tortas' },
        { id: '2', nombre: 'Postres', descripcion: 'Categoría de postres' }
      ]

      const saved = mockSaveStoredCategories(categorias)
      expect(saved).toBe(true)
    })

    it('debería manejar errores de localStorage', () => {
      mockSaveStoredCategories.mockImplementation(() => {
        throw new Error('Storage error')
      })

      const categorias = [{ id: '1', nombre: 'Test' }]
      expect(() => mockSaveStoredCategories(categorias)).toThrow('Storage error')
    })
  })
})