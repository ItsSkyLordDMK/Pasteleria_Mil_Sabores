import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Carrito from '../pages/tienda/Carrito'

// Mock del contexto del carrito
const mockCarrito = [
  {
    id: '1',
    nombre: 'Torta de Chocolate',
    precio: 15000,
    cantidad: 2,
    imagen: 'torta-chocolate.jpg'
  },
  {
    id: '2',
    nombre: 'Cheesecake',
    precio: 12000,
    cantidad: 1,
    imagen: 'cheesecake.jpg'
  }
]

const mockUseCarrito = () => ({
  carrito: mockCarrito,
  obtenerTotal: () => 42000,
  obtenerCantidadTotal: () => 3,
  actualizarCantidad: vi.fn(),
  eliminarProducto: vi.fn(),
  vaciarCarrito: vi.fn()
})

vi.mock('../contexts/CarritoContext', () => ({
  useCarrito: mockUseCarrito
}))

// Mock de utilidades
vi.mock('../utils/offers', () => ({
  calculateItemPricing: vi.fn(() => ({
    finalUnitPrice: 15000,
    discount: 0,
    hasDiscount: false
  }))
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Carrito Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado', () => {
    it('debería renderizar la página del carrito', () => {
      renderWithRouter(<Carrito />)
      
      expect(screen.getByText(/carrito de compras/i)).toBeInTheDocument()
    })

    it('debería mostrar productos en el carrito', () => {
      renderWithRouter(<Carrito />)
      
      expect(screen.getByText('Torta de Chocolate')).toBeInTheDocument()
      expect(screen.getByText('Cheesecake')).toBeInTheDocument()
    })

    it('debería mostrar cantidades de productos', () => {
      renderWithRouter(<Carrito />)
      
      expect(screen.getByDisplayValue('2')).toBeInTheDocument() // Cantidad de Torta
      expect(screen.getByDisplayValue('1')).toBeInTheDocument() // Cantidad de Cheesecake
    })

    it('debería mostrar precios de productos', () => {
      renderWithRouter(<Carrito />)
      
      expect(screen.getByText('$15.000')).toBeInTheDocument()
      expect(screen.getByText('$12.000')).toBeInTheDocument()
    })
  })

  describe('Resumen del carrito', () => {
    it('debería mostrar total del carrito', () => {
      renderWithRouter(<Carrito />)
      
      expect(screen.getByText('$42.000')).toBeInTheDocument()
    })

    it('debería mostrar cantidad total de productos', () => {
      renderWithRouter(<Carrito />)
      
      expect(screen.getByText(/3 productos/i)).toBeInTheDocument()
    })

    it('debería mostrar subtotal', () => {
      renderWithRouter(<Carrito />)
      
      expect(screen.getByText(/subtotal/i)).toBeInTheDocument()
    })
  })

  describe('Funcionalidad de cantidad', () => {
    it('debería permitir aumentar cantidad', () => {
      const mockActualizarCantidad = vi.fn()
      const mockUseCarritoConFuncion = () => ({
        ...mockUseCarrito(),
        actualizarCantidad: mockActualizarCantidad
      })
      
      vi.mocked(require('../contexts/CarritoContext').useCarrito).mockImplementation(mockUseCarritoConFuncion)
      
      renderWithRouter(<Carrito />)
      
      const increaseButton = screen.getAllByText('+')[0]
      fireEvent.click(increaseButton)
      
      expect(mockActualizarCantidad).toHaveBeenCalledWith('1', 1)
    })

    it('debería permitir disminuir cantidad', () => {
      const mockActualizarCantidad = vi.fn()
      const mockUseCarritoConFuncion = () => ({
        ...mockUseCarrito(),
        actualizarCantidad: mockActualizarCantidad
      })
      
      vi.mocked(require('../contexts/CarritoContext').useCarrito).mockImplementation(mockUseCarritoConFuncion)
      
      renderWithRouter(<Carrito />)
      
      const decreaseButton = screen.getAllByText('-')[0]
      fireEvent.click(decreaseButton)
      
      expect(mockActualizarCantidad).toHaveBeenCalledWith('1', -1)
    })

    it('debería permitir cambiar cantidad directamente', () => {
      const mockActualizarCantidad = vi.fn()
      const mockUseCarritoConFuncion = () => ({
        ...mockUseCarrito(),
        actualizarCantidad: mockActualizarCantidad
      })
      
      vi.mocked(require('../contexts/CarritoContext').useCarrito).mockImplementation(mockUseCarritoConFuncion)
      
      renderWithRouter(<Carrito />)
      
      const quantityInput = screen.getByDisplayValue('2')
      fireEvent.change(quantityInput, { target: { value: '5' } })
      
      expect(mockActualizarCantidad).toHaveBeenCalledWith('1', 3) // 5 - 2 = 3
    })
  })

  describe('Eliminación de productos', () => {
    it('debería permitir eliminar productos', () => {
      const mockEliminarProducto = vi.fn()
      const mockUseCarritoConFuncion = () => ({
        ...mockUseCarrito(),
        eliminarProducto: mockEliminarProducto
      })
      
      vi.mocked(require('../contexts/CarritoContext').useCarrito).mockImplementation(mockUseCarritoConFuncion)
      
      renderWithRouter(<Carrito />)
      
      const deleteButton = screen.getAllByText(/eliminar/i)[0]
      fireEvent.click(deleteButton)
      
      expect(mockEliminarProducto).toHaveBeenCalledWith('1')
    })
  })

  describe('Vaciar carrito', () => {
    it('debería permitir vaciar el carrito', () => {
      const mockVaciarCarrito = vi.fn()
      const mockUseCarritoConFuncion = () => ({
        ...mockUseCarrito(),
        vaciarCarrito: mockVaciarCarrito
      })
      
      vi.mocked(require('../contexts/CarritoContext').useCarrito).mockImplementation(mockUseCarritoConFuncion)
      
      renderWithRouter(<Carrito />)
      
      const clearButton = screen.getByText(/vaciar carrito/i)
      fireEvent.click(clearButton)
      
      expect(mockVaciarCarrito).toHaveBeenCalled()
    })
  })

  describe('Proceder al checkout', () => {
    it('debería mostrar botón de proceder al checkout', () => {
      renderWithRouter(<Carrito />)
      
      expect(screen.getByText(/proceder al checkout/i)).toBeInTheDocument()
    })

    it('debería navegar al checkout', () => {
      renderWithRouter(<Carrito />)
      
      const checkoutButton = screen.getByText(/proceder al checkout/i)
      expect(checkoutButton.closest('a')).toHaveAttribute('href', '/checkout')
    })
  })

  describe('Carrito vacío', () => {
    it('debería mostrar mensaje cuando el carrito está vacío', () => {
      const mockUseCarritoVacio = () => ({
        carrito: [],
        obtenerTotal: () => 0,
        obtenerCantidadTotal: () => 0,
        actualizarCantidad: vi.fn(),
        eliminarProducto: vi.fn(),
        vaciarCarrito: vi.fn()
      })
      
      vi.mocked(require('../contexts/CarritoContext').useCarrito).mockImplementation(mockUseCarritoVacio)
      
      renderWithRouter(<Carrito />)
      
      expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument()
    })

    it('debería mostrar enlace para continuar comprando', () => {
      const mockUseCarritoVacio = () => ({
        carrito: [],
        obtenerTotal: () => 0,
        obtenerCantidadTotal: () => 0,
        actualizarCantidad: vi.fn(),
        eliminarProducto: vi.fn(),
        vaciarCarrito: vi.fn()
      })
      
      vi.mocked(require('../contexts/CarritoContext').useCarrito).mockImplementation(mockUseCarritoVacio)
      
      renderWithRouter(<Carrito />)
      
      const continueShoppingLink = screen.getByText(/continuar comprando/i)
      expect(continueShoppingLink.closest('a')).toHaveAttribute('href', '/productos')
    })
  })

  describe('Descuentos', () => {
    it('debería mostrar descuentos si los hay', () => {
      const { calculateItemPricing } = require('../utils/offers')
      calculateItemPricing.mockReturnValue({
        finalUnitPrice: 13500,
        discount: 1500,
        hasDiscount: true
      })
      
      renderWithRouter(<Carrito />)
      
      expect(screen.getByText(/descuento/i)).toBeInTheDocument()
    })
  })

  describe('Responsividad', () => {
    it('debería aplicar clases CSS responsivas', () => {
      renderWithRouter(<Carrito />)
      
      const container = screen.getByText(/carrito de compras/i).closest('.container')
      expect(container).toHaveClass('container')
    })
  })

  describe('Accesibilidad', () => {
    it('debería tener estructura semántica correcta', () => {
      renderWithRouter(<Carrito />)
      
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('debería tener labels correctos para inputs', () => {
      renderWithRouter(<Carrito />)
      
      const quantityInputs = screen.getAllByLabelText(/cantidad/i)
      expect(quantityInputs.length).toBeGreaterThan(0)
    })
  })

  describe('Manejo de errores', () => {
    it('debería manejar errores en el contexto del carrito', () => {
      const mockUseCarritoError = () => {
        throw new Error('Carrito error')
      }
      
      vi.mocked(require('../contexts/CarritoContext').useCarrito).mockImplementation(mockUseCarritoError)
      
      expect(() => {
        renderWithRouter(<Carrito />)
      }).not.toThrow()
    })
  })

  describe('Performance', () => {
    it('debería cargar eficientemente', () => {
      const startTime = performance.now()
      renderWithRouter(<Carrito />)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(1000)
    })
  })
})
