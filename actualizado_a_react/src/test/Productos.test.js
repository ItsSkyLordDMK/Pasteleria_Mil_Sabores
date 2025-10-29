import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Productos from '../pages/tienda/Productos'

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
    },
    {
      id: '3',
      nombre: 'Tiramisu',
      precio: 10000,
      categoria: 'postres',
      imagen: 'tiramisu.jpg',
      stock: 0
    }
  ])
}))

vi.mock('../utils/categories', () => ({
  getStoredCategories: vi.fn(() => [
    {
      id: '1',
      nombre: 'Tortas',
      descripcion: 'Deliciosas tortas'
    },
    {
      id: '2',
      nombre: 'Postres',
      descripcion: 'Postres únicos'
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

describe('Productos Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado', () => {
    it('debería renderizar la página de productos', () => {
      renderWithRouter(<Productos />)
      
      expect(screen.getByText(/productos/i)).toBeInTheDocument()
    })

    it('debería mostrar todos los productos', () => {
      renderWithRouter(<Productos />)
      
      expect(screen.getByText('Torta de Chocolate')).toBeInTheDocument()
      expect(screen.getByText('Cheesecake')).toBeInTheDocument()
      expect(screen.getByText('Tiramisu')).toBeInTheDocument()
    })

    it('debería mostrar filtros de categoría', () => {
      renderWithRouter(<Productos />)
      
      expect(screen.getByText('Todas')).toBeInTheDocument()
      expect(screen.getByText('Tortas')).toBeInTheDocument()
      expect(screen.getByText('Postres')).toBeInTheDocument()
    })
  })

  describe('Filtros', () => {
    it('debería filtrar productos por categoría', () => {
      renderWithRouter(<Productos />)
      
      const tortasFilter = screen.getByText('Tortas')
      fireEvent.click(tortasFilter)
      
      expect(screen.getByText('Torta de Chocolate')).toBeInTheDocument()
      expect(screen.queryByText('Cheesecake')).not.toBeInTheDocument()
    })

    it('debería mostrar todos los productos al seleccionar "Todas"', () => {
      renderWithRouter(<Productos />)
      
      // Primero filtrar por una categoría
      const postresFilter = screen.getByText('Postres')
      fireEvent.click(postresFilter)
      
      // Luego volver a "Todas"
      const todasFilter = screen.getByText('Todas')
      fireEvent.click(todasFilter)
      
      expect(screen.getByText('Torta de Chocolate')).toBeInTheDocument()
      expect(screen.getByText('Cheesecake')).toBeInTheDocument()
      expect(screen.getByText('Tiramisu')).toBeInTheDocument()
    })
  })

  describe('Búsqueda', () => {
    it('debería mostrar campo de búsqueda', () => {
      renderWithRouter(<Productos />)
      
      const searchInput = screen.getByPlaceholderText(/buscar productos/i)
      expect(searchInput).toBeInTheDocument()
    })

    it('debería filtrar productos por búsqueda', () => {
      renderWithRouter(<Productos />)
      
      const searchInput = screen.getByPlaceholderText(/buscar productos/i)
      fireEvent.change(searchInput, { target: { value: 'chocolate' } })
      
      expect(screen.getByText('Torta de Chocolate')).toBeInTheDocument()
      expect(screen.queryByText('Cheesecake')).not.toBeInTheDocument()
    })

    it('debería mostrar mensaje cuando no hay resultados', () => {
      renderWithRouter(<Productos />)
      
      const searchInput = screen.getByPlaceholderText(/buscar productos/i)
      fireEvent.change(searchInput, { target: { value: 'producto inexistente' } })
      
      expect(screen.getByText(/no se encontraron productos/i)).toBeInTheDocument()
    })
  })

  describe('Ordenamiento', () => {
    it('debería mostrar opciones de ordenamiento', () => {
      renderWithRouter(<Productos />)
      
      const sortSelect = screen.getByLabelText(/ordenar por/i)
      expect(sortSelect).toBeInTheDocument()
    })

    it('debería ordenar productos por precio ascendente', () => {
      renderWithRouter(<Productos />)
      
      const sortSelect = screen.getByLabelText(/ordenar por/i)
      fireEvent.change(sortSelect, { target: { value: 'precio-asc' } })
      
      const productos = screen.getAllByText(/\$\d+/)
      expect(productos[0]).toHaveTextContent('$10.000')
    })

    it('debería ordenar productos por precio descendente', () => {
      renderWithRouter(<Productos />)
      
      const sortSelect = screen.getByLabelText(/ordenar por/i)
      fireEvent.change(sortSelect, { target: { value: 'precio-desc' } })
      
      const productos = screen.getAllByText(/\$\d+/)
      expect(productos[0]).toHaveTextContent('$15.000')
    })

    it('debería ordenar productos por nombre', () => {
      renderWithRouter(<Productos />)
      
      const sortSelect = screen.getByLabelText(/ordenar por/i)
      fireEvent.change(sortSelect, { target: { value: 'nombre' } })
      
      const productos = screen.getAllByText(/Torta|Cheesecake|Tiramisu/)
      expect(productos[0]).toHaveTextContent('Cheesecake')
    })
  })

  describe('Stock', () => {
    it('debería mostrar productos sin stock', () => {
      renderWithRouter(<Productos />)
      
      expect(screen.getByText('Tiramisu')).toBeInTheDocument()
    })

    it('debería mostrar badge de sin stock', () => {
      renderWithRouter(<Productos />)
      
      expect(screen.getByText('Sin Stock')).toBeInTheDocument()
    })
  })

  describe('Paginación', () => {
    it('debería mostrar controles de paginación', () => {
      renderWithRouter(<Productos />)
      
      expect(screen.getByText(/página/i)).toBeInTheDocument()
    })

    it('debería cambiar de página', () => {
      renderWithRouter(<Productos />)
      
      const nextButton = screen.getByText(/siguiente/i)
      fireEvent.click(nextButton)
      
      expect(screen.getByText(/página 2/i)).toBeInTheDocument()
    })
  })

  describe('Manejo de datos vacíos', () => {
    it('debería manejar cuando no hay productos', () => {
      const { getStoredProducts } = require('../utils/products')
      getStoredProducts.mockReturnValue([])
      
      renderWithRouter(<Productos />)
      
      expect(screen.getByText(/no hay productos disponibles/i)).toBeInTheDocument()
    })
  })

  describe('Manejo de errores', () => {
    it('debería manejar errores al cargar productos', () => {
      const { getStoredProducts } = require('../utils/products')
      getStoredProducts.mockImplementation(() => {
        throw new Error('Error loading products')
      })
      
      expect(() => {
        renderWithRouter(<Productos />)
      }).not.toThrow()
    })
  })

  describe('Accesibilidad', () => {
    it('debería tener estructura semántica correcta', () => {
      renderWithRouter(<Productos />)
      
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('debería tener labels correctos', () => {
      renderWithRouter(<Productos />)
      
      expect(screen.getByLabelText(/ordenar por/i)).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('debería cargar eficientemente', () => {
      const startTime = performance.now()
      renderWithRouter(<Productos />)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(1000)
    })
  })
})
