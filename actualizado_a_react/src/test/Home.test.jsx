import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../pages/tienda/Home'

// Mock de las utilidades
vi.mock('../utils/products', () => ({
  getStoredProducts: vi.fn(() => [
    {
      id: '1',
      nombre: 'Torta de Chocolate',
      precio: 15000,
      categoria: 'tortas',
      imagen: 'torta-chocolate.jpg',
      stock: 5
    }
  ])
}))

vi.mock('../utils/categories', () => ({
  getStoredCategories: vi.fn(() => [
    {
      id: '1',
      nombre: 'Tortas',
      descripcion: 'Deliciosas tortas',
      imagen: 'tortas.jpg'
    }
  ])
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado', () => {
    it('debería renderizar la página de inicio', () => {
      renderWithRouter(<Home />)
      
      expect(screen.getByText(/bienvenido/i)).toBeInTheDocument()
    })

    it('debería mostrar productos destacados', () => {
      renderWithRouter(<Home />)
      
      expect(screen.getByText('Torta de Chocolate')).toBeInTheDocument()
    })

    it('debería mostrar categorías', () => {
      renderWithRouter(<Home />)
      
      expect(screen.getByText('Tortas')).toBeInTheDocument()
    })
  })

  describe('Secciones principales', () => {
    it('debería mostrar sección hero', () => {
      renderWithRouter(<Home />)
      
      const heroSection = screen.getByText(/bienvenido/i).closest('section')
      expect(heroSection).toBeInTheDocument()
    })

    it('debería mostrar sección de productos destacados', () => {
      renderWithRouter(<Home />)
      
      expect(screen.getByText(/productos destacados/i)).toBeInTheDocument()
    })

    it('debería mostrar sección de categorías', () => {
      renderWithRouter(<Home />)
      
      expect(screen.getByText(/categorías/i)).toBeInTheDocument()
    })
  })

  describe('Enlaces de navegación', () => {
    it('debería tener enlaces a productos', () => {
      renderWithRouter(<Home />)
      
      const productosLink = screen.getByText('Ver todos los productos')
      expect(productosLink.closest('a')).toHaveAttribute('href', '/productos')
    })

    it('debería tener enlaces a categorías', () => {
      renderWithRouter(<Home />)
      
      const categoriasLink = screen.getByText('Ver todas las categorías')
      expect(categoriasLink.closest('a')).toHaveAttribute('href', '/categorias')
    })
  })

  describe('Imágenes', () => {
    it('debería mostrar imágenes de productos', () => {
      renderWithRouter(<Home />)
      
      const productImages = screen.getAllByRole('img')
      expect(productImages.length).toBeGreaterThan(0)
    })
  })

  describe('Manejo de errores', () => {
    it('debería manejar errores al cargar productos', () => {
      const { getStoredProducts } = require('../utils/products')
      getStoredProducts.mockImplementation(() => {
        throw new Error('Error loading products')
      })
      
      expect(() => {
        renderWithRouter(<Home />)
      }).not.toThrow()
    })
  })
})