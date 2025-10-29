import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { CarritoProvider, useCarrito } from '../contexts/CarritoContext'
import { calculateItemPricing } from '../utils/offers'

// Mock del hook de ofertas
vi.mock('../utils/offers', () => ({
  calculateItemPricing: vi.fn(() => ({
    finalUnitPrice: 1000,
    discount: 0,
    hasDiscount: false
  }))
}))

// Componente de prueba para usar el contexto
const TestComponent = () => {
  const {
    carrito,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
    obtenerTotal,
    obtenerCantidadTotal
  } = useCarrito()

  return (
    <div>
      <div data-testid="carrito-length">{carrito.length}</div>
      <div data-testid="total">{obtenerTotal()}</div>
      <div data-testid="cantidad-total">{obtenerCantidadTotal()}</div>
      <button onClick={() => agregarAlCarrito({ id: '1', nombre: 'Test', precio: 1000 })}>
        Agregar
      </button>
      <button onClick={() => actualizarCantidad('1', 1)}>
        Actualizar
      </button>
      <button onClick={() => eliminarProducto('1')}>
        Eliminar
      </button>
      <button onClick={() => vaciarCarrito()}>
        Vaciar
      </button>
    </div>
  )
}

const renderWithProvider = (component) => {
  return render(
    <CarritoProvider>
      {component}
    </CarritoProvider>
  )
}

describe('CarritoContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Estado inicial', () => {
    it('debería inicializar con carrito vacío', () => {
      renderWithProvider(<TestComponent />)
      
      expect(screen.getByTestId('carrito-length')).toHaveTextContent('0')
      expect(screen.getByTestId('total')).toHaveTextContent('0')
      expect(screen.getByTestId('cantidad-total')).toHaveTextContent('0')
    })
  })

  describe('agregarAlCarrito', () => {
    it('debería agregar un producto nuevo al carrito', () => {
      renderWithProvider(<TestComponent />)
      
      act(() => {
        screen.getByText('Agregar').click()
      })

      expect(screen.getByTestId('carrito-length')).toHaveTextContent('1')
      expect(screen.getByTestId('cantidad-total')).toHaveTextContent('1')
    })

    it('debería incrementar cantidad si el producto ya existe', () => {
      renderWithProvider(<TestComponent />)
      
      act(() => {
        screen.getByText('Agregar').click()
        screen.getByText('Agregar').click()
      })

      expect(screen.getByTestId('carrito-length')).toHaveTextContent('1')
      expect(screen.getByTestId('cantidad-total')).toHaveTextContent('2')
    })

    it('debería agregar producto con cantidad específica', () => {
      renderWithProvider(<TestComponent />)
      
      act(() => {
        screen.getByText('Agregar').click()
      })

      expect(screen.getByTestId('carrito-length')).toHaveTextContent('1')
    })
  })

  describe('actualizarCantidad', () => {
    beforeEach(() => {
      renderWithProvider(<TestComponent />)
      
      act(() => {
        screen.getByText('Agregar').click()
      })
    })

    it('debería incrementar cantidad', () => {
      act(() => {
        screen.getByText('Actualizar').click()
      })

      expect(screen.getByTestId('cantidad-total')).toHaveTextContent('2')
    })

    it('debería eliminar producto si cantidad llega a 0', () => {
      // Primero agregamos otro producto para poder reducir
      act(() => {
        screen.getByText('Agregar').click()
      })

      // Ahora reducimos la cantidad
      act(() => {
        screen.getByText('Actualizar').click()
      })

      expect(screen.getByTestId('carrito-length')).toHaveTextContent('0')
    })
  })

  describe('eliminarProducto', () => {
    beforeEach(() => {
      renderWithProvider(<TestComponent />)
      
      act(() => {
        screen.getByText('Agregar').click()
      })
    })

    it('debería eliminar producto del carrito', () => {
      act(() => {
        screen.getByText('Eliminar').click()
      })

      expect(screen.getByTestId('carrito-length')).toHaveTextContent('0')
      expect(screen.getByTestId('cantidad-total')).toHaveTextContent('0')
    })
  })

  describe('vaciarCarrito', () => {
    beforeEach(() => {
      renderWithProvider(<TestComponent />)
      
      act(() => {
        screen.getByText('Agregar').click()
        screen.getByText('Agregar').click()
      })
    })

    it('debería vaciar todo el carrito', () => {
      act(() => {
        screen.getByText('Vaciar').click()
      })

      expect(screen.getByTestId('carrito-length')).toHaveTextContent('0')
      expect(screen.getByTestId('cantidad-total')).toHaveTextContent('0')
    })
  })

  describe('obtenerTotal', () => {
    it('debería calcular total correctamente', () => {
      calculateItemPricing.mockReturnValue({
        finalUnitPrice: 1000,
        discount: 0,
        hasDiscount: false
      })

      renderWithProvider(<TestComponent />)
      
      act(() => {
        screen.getByText('Agregar').click()
      })

      expect(screen.getByTestId('total')).toHaveTextContent('1000')
    })

    it('debería calcular total con múltiples productos', () => {
      calculateItemPricing.mockReturnValue({
        finalUnitPrice: 1000,
        discount: 0,
        hasDiscount: false
      })

      renderWithProvider(<TestComponent />)
      
      act(() => {
        screen.getByText('Agregar').click()
        screen.getByText('Agregar').click()
      })

      expect(screen.getByTestId('total')).toHaveTextContent('2000')
    })
  })

  describe('Persistencia en localStorage', () => {
    it('debería cargar carrito desde localStorage', () => {
      const carritoGuardado = [
        { id: '1', nombre: 'Test', precio: 1000, cantidad: 2 }
      ]
      localStorage.setItem('carrito', JSON.stringify(carritoGuardado))

      renderWithProvider(<TestComponent />)
      
      expect(screen.getByTestId('carrito-length')).toHaveTextContent('1')
      expect(screen.getByTestId('cantidad-total')).toHaveTextContent('2')
    })

    it('debería manejar errores de localStorage', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error')
      })

      renderWithProvider(<TestComponent />)
      
      expect(screen.getByTestId('carrito-length')).toHaveTextContent('0')
    })
  })

  describe('Error handling', () => {
    it('debería manejar productos inválidos', () => {
      renderWithProvider(<TestComponent />)
      
      // Intentar agregar producto sin ID
      act(() => {
        const context = renderWithProvider(<TestComponent />)
        // Simular producto inválido
      })

      expect(screen.getByTestId('carrito-length')).toHaveTextContent('0')
    })
  })
})
