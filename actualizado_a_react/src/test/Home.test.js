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
    },
    {
      id: '2',
      nombre: 'Cheesecake',
      precio: 12000,
      categoria: 'postres',
      imagen: 'cheesecake.jpg',
      stock: 3
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
    },
    {
      id: '2',
      nombre: 'Postres',
      descripcion: 'Postres únicos',
      imagen: 'postres.jpg'
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
      expect(screen.getByText('Cheesecake')).toBeInTheDocument()
    })

    it('debería mostrar categorías', () => {
      renderWithRouter(<Home />)
      
      expect(screen.getByText('Tortas')).toBeInTheDocument()
      expect(screen.getByText('Postres')).toBeInTheDocument()
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

    it('debería mostrar sección de nosotros', () => {
      renderWithRouter(<Home />)
      
      expect(screen.getByText(/sobre nosotros/i)).toBeInTheDocument()
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

    it('debería tener enlaces a nosotros', () => {
      renderWithRouter(<Home />)
      
      const nosotrosLink = screen.getByText('Conoce más')
      expect(nosotrosLink.closest('a')).toHaveAttribute('href', '/nosotros')
    })
  })

  describe('Imágenes', () => {
    it('debería mostrar imágenes de productos', () => {
      renderWithRouter(<Home />)
      
      const productImages = screen.getAllByRole('img')
      expect(productImages.length).toBeGreaterThan(0)
    })

    it('debería mostrar imágenes de categorías', () => {
      renderWithRouter(<Home />)
      
      const categoryImages = screen.getAllByRole('img')
      expect(categoryImages.length).toBeGreaterThan(0)
    })
  })

  describe('Responsividad', () => {
    it('debería aplicar clases CSS responsivas', () => {
      renderWithRouter(<Home />)
      
      const container = screen.getByText(/bienvenido/i).closest('.container')
      expect(container).toHaveClass('container')
    })
  })

  describe('Manejo de datos vacíos', () => {
    it('debería manejar cuando no hay productos', () => {
      const { getStoredProducts } = require('../utils/products')
      getStoredProducts.mockReturnValue([])
      
      renderWithRouter(<Home />)
      
      expect(screen.getByText(/no hay productos disponibles/i)).toBeInTheDocument()
    })

    it('debería manejar cuando no hay categorías', () => {
      const { getStoredCategories } = require('../utils/categories')
      getStoredCategories.mockReturnValue([])
      
      renderWithRouter(<Home />)
      
      expect(screen.getByText(/no hay categorías disponibles/i)).toBeInTheDocument()
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

    it('debería manejar errores al cargar categorías', () => {
      const { getStoredCategories } = require('../utils/categories')
      getStoredCategories.mockImplementation(() => {
        throw new Error('Error loading categories')
      })
      
      expect(() => {
        renderWithRouter(<Home />)
      }).not.toThrow()
    })
  })

  describe('Accesibilidad', () => {
    it('debería tener estructura semántica correcta', () => {
      renderWithRouter(<Home />)
      
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('debería tener headings jerárquicos', () => {
      renderWithRouter(<Home />)
      
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('debería cargar eficientemente', () => {
      const startTime = performance.now()
      renderWithRouter(<Home />)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(1000) // Menos de 1 segundo
    })
  })
})
