import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

// Mock del contexto del carrito
const mockAgregarAlCarrito = vi.fn()
const mockUseCarrito = () => ({
  agregarAlCarrito: mockAgregarAlCarrito,
  carrito: []
})

vi.mock('../contexts/CarritoContext', () => ({
  useCarrito: mockUseCarrito
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('ProductCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockProduct = {
    id: '1',
    nombre: 'Torta de Chocolate',
    precio: 15000,
    categoria: 'tortas',
    descripcion: 'Deliciosa torta de chocolate',
    imagen: 'torta-chocolate.jpg',
    stock: 5
  }

  describe('Renderizado', () => {
    it('debería renderizar la información del producto', () => {
      renderWithRouter(<ProductCard producto={mockProduct} />)
      
      expect(screen.getByText('Torta de Chocolate')).toBeInTheDocument()
      expect(screen.getByText('tortas')).toBeInTheDocument()
      expect(screen.getByText('$15.000')).toBeInTheDocument()
    })

    it('debería mostrar la imagen del producto', () => {
      renderWithRouter(<ProductCard producto={mockProduct} />)
      
      const imagen = screen.getByRole('img')
      expect(imagen).toBeInTheDocument()
      expect(imagen).toHaveAttribute('src', 'torta-chocolate.jpg')
      expect(imagen).toHaveAttribute('alt', 'Torta de Chocolate')
    })

    it('debería mostrar botones de acción', () => {
      renderWithRouter(<ProductCard producto={mockProduct} />)
      
      expect(screen.getByText('Ver Detalle')).toBeInTheDocument()
      expect(screen.getByText('Agregar')).toBeInTheDocument()
    })
  })

  describe('Badge de stock', () => {
    it('debería mostrar badge de stock bajo', () => {
      const productoStockBajo = { ...mockProduct, stock: 2 }
      renderWithRouter(<ProductCard producto={productoStockBajo} />)
      
      expect(screen.getByText('Stock Bajo')).toBeInTheDocument()
    })

    it('debería mostrar badge de sin stock', () => {
      const productoSinStock = { ...mockProduct, stock: 0 }
      renderWithRouter(<ProductCard producto={productoSinStock} />)
      
      expect(screen.getByText('Sin Stock')).toBeInTheDocument()
    })

    it('debería mostrar badge de stock normal', () => {
      const productoStockNormal = { ...mockProduct, stock: 10 }
      renderWithRouter(<ProductCard producto={productoStockNormal} />)
      
      expect(screen.queryByText('Stock Bajo')).not.toBeInTheDocument()
      expect(screen.queryByText('Sin Stock')).not.toBeInTheDocument()
    })
  })

  describe('Funcionalidad de botones', () => {
    it('debería llamar agregarAlCarrito al hacer clic en Agregar', () => {
      renderWithRouter(<ProductCard producto={mockProduct} />)
      
      const agregarButton = screen.getByText('Agregar')
      fireEvent.click(agregarButton)
      
      expect(mockAgregarAlCarrito).toHaveBeenCalledWith(mockProduct)
    })

    it('debería navegar a detalle del producto', () => {
      renderWithRouter(<ProductCard producto={mockProduct} />)
      
      const detalleButton = screen.getByText('Ver Detalle')
      expect(detalleButton.closest('a')).toHaveAttribute('href', '/producto/1')
    })

    it('debería deshabilitar botón Agregar si no hay stock', () => {
      const productoSinStock = { ...mockProduct, stock: 0 }
      renderWithRouter(<ProductCard producto={productoSinStock} />)
      
      const agregarButton = screen.getByText('Agregar')
      expect(agregarButton).toBeDisabled()
    })
  })

  describe('Formato de precio', () => {
    it('debería formatear precio correctamente', () => {
      renderWithRouter(<ProductCard producto={mockProduct} />)
      
      expect(screen.getByText('$15.000')).toBeInTheDocument()
    })

    it('debería manejar precios con decimales', () => {
      const productoConDecimales = { ...mockProduct, precio: 15999 }
      renderWithRouter(<ProductCard producto={productoConDecimales} />)
      
      expect(screen.getByText('$15.999')).toBeInTheDocument()
    })

    it('debería manejar precios altos', () => {
      const productoCaro = { ...mockProduct, precio: 150000 }
      renderWithRouter(<ProductCard producto={productoCaro} />)
      
      expect(screen.getByText('$150.000')).toBeInTheDocument()
    })
  })

  describe('Productos sin imagen', () => {
    it('debería mostrar imagen por defecto si no hay imagen', () => {
      const productoSinImagen = { ...mockProduct, imagen: null }
      renderWithRouter(<ProductCard producto={productoSinImagen} />)
      
      const imagen = screen.getByRole('img')
      expect(imagen).toHaveAttribute('src', '/img/placeholder.jpg')
    })

    it('debería mostrar imagen por defecto si imagen está vacía', () => {
      const productoSinImagen = { ...mockProduct, imagen: '' }
      renderWithRouter(<ProductCard producto={productoSinImagen} />)
      
      const imagen = screen.getByRole('img')
      expect(imagen).toHaveAttribute('src', '/img/placeholder.jpg')
    })
  })

  describe('Accesibilidad', () => {
    it('debería tener atributos de accesibilidad correctos', () => {
      renderWithRouter(<ProductCard producto={mockProduct} />)
      
      const imagen = screen.getByRole('img')
      expect(imagen).toHaveAttribute('alt', 'Torta de Chocolate')
      
      const detalleButton = screen.getByText('Ver Detalle')
      expect(detalleButton).toHaveAttribute('aria-label', 'Ver detalle de Torta de Chocolate')
    })

    it('debería ser navegable con teclado', () => {
      renderWithRouter(<ProductCard producto={mockProduct} />)
      
      const agregarButton = screen.getByText('Agregar')
      agregarButton.focus()
      expect(agregarButton).toHaveFocus()
    })
  })

  describe('Manejo de errores', () => {
    it('debería manejar producto sin propiedades requeridas', () => {
      const productoIncompleto = { id: '1' }
      
      expect(() => {
        renderWithRouter(<ProductCard producto={productoIncompleto} />)
      }).not.toThrow()
    })

    it('debería manejar producto null', () => {
      expect(() => {
        renderWithRouter(<ProductCard producto={null} />)
      }).not.toThrow()
    })
  })
})