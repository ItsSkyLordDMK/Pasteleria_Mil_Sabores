import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../components/Header'

// Mock del contexto del carrito
const mockCarrito = [
  { id: '1', nombre: 'Producto 1', cantidad: 2 },
  { id: '2', nombre: 'Producto 2', cantidad: 1 }
]

const mockUseCarrito = () => ({
  carrito: mockCarrito,
  obtenerCantidadTotal: () => 3
})

vi.mock('../contexts/CarritoContext', () => ({
  useCarrito: mockUseCarrito
}))

// Mock de autenticación
const mockGetCurrentUser = vi.fn(() => ({
  correo: 'test@test.com',
  nombre: 'Test User',
  isAdmin: false
}))

vi.mock('../utils/auth', () => ({
  getCurrentUser: mockGetCurrentUser,
  isLoggedIn: () => true
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado', () => {
    it('debería renderizar el logo', () => {
      renderWithRouter(<Header />)
      
      const logo = screen.getByAltText('Mil Sabores')
      expect(logo).toBeInTheDocument()
    })

    it('debería renderizar la navegación principal', () => {
      renderWithRouter(<Header />)
      
      expect(screen.getByText('Inicio')).toBeInTheDocument()
      expect(screen.getByText('Productos')).toBeInTheDocument()
      expect(screen.getByText('Categorías')).toBeInTheDocument()
      expect(screen.getByText('Nosotros')).toBeInTheDocument()
      expect(screen.getByText('Contacto')).toBeInTheDocument()
    })

    it('debería mostrar información del usuario cuando está logueado', () => {
      renderWithRouter(<Header />)
      
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('debería mostrar botón de carrito con cantidad', () => {
      renderWithRouter(<Header />)
      
      expect(screen.getByText('Carrito')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument() // Cantidad total del carrito
    })
  })

  describe('Navegación', () => {
    it('debería tener enlaces correctos', () => {
      renderWithRouter(<Header />)
      
      expect(screen.getByText('Inicio').closest('a')).toHaveAttribute('href', '/')
      expect(screen.getByText('Productos').closest('a')).toHaveAttribute('href', '/productos')
      expect(screen.getByText('Categorías').closest('a')).toHaveAttribute('href', '/categorias')
      expect(screen.getByText('Nosotros').closest('a')).toHaveAttribute('href', '/nosotros')
      expect(screen.getByText('Contacto').closest('a')).toHaveAttribute('href', '/contacto')
    })

    it('debería mostrar dropdown de productos', () => {
      renderWithRouter(<Header />)
      
      const productosLink = screen.getByText('Productos')
      fireEvent.mouseEnter(productosLink)
      
      expect(screen.getByText('Ver todas las categorías')).toBeInTheDocument()
    })

    it('debería mostrar dropdown de categorías', () => {
      renderWithRouter(<Header />)
      
      const categoriasLink = screen.getByText('Categorías')
      fireEvent.mouseEnter(categoriasLink)
      
      expect(screen.getByText('Ver todas las categorías')).toBeInTheDocument()
    })
  })

  describe('Usuario logueado', () => {
    it('debería mostrar opciones de usuario logueado', () => {
      renderWithRouter(<Header />)
      
      expect(screen.getByText('Perfil')).toBeInTheDocument()
      expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument()
    })

    it('debería mostrar enlace a carrito', () => {
      renderWithRouter(<Header />)
      
      const carritoLink = screen.getByText('Carrito').closest('a')
      expect(carritoLink).toHaveAttribute('href', '/carrito')
    })
  })

  describe('Usuario no logueado', () => {
    beforeEach(() => {
      mockGetCurrentUser.mockReturnValue(null)
      vi.mocked(require('../utils/auth').isLoggedIn).mockReturnValue(false)
    })

    it('debería mostrar opciones de usuario no logueado', () => {
      renderWithRouter(<Header />)
      
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
      expect(screen.getByText('Registrarse')).toBeInTheDocument()
    })
  })

  describe('Usuario admin', () => {
    beforeEach(() => {
      mockGetCurrentUser.mockReturnValue({
        correo: 'admin@profesor.duoc.cl',
        nombre: 'Admin User',
        isAdmin: true
      })
    })

    it('debería mostrar enlace a admin', () => {
      renderWithRouter(<Header />)
      
      expect(screen.getByText('Admin')).toBeInTheDocument()
    })
  })

  describe('Funcionalidad del carrito', () => {
    it('debería mostrar cantidad correcta en el badge', () => {
      renderWithRouter(<Header />)
      
      const badge = screen.getByText('3')
      expect(badge).toBeInTheDocument()
    })

    it('debería mostrar 0 cuando el carrito está vacío', () => {
      const mockUseCarritoVacio = () => ({
        carrito: [],
        obtenerCantidadTotal: () => 0
      })
      
      vi.mocked(require('../contexts/CarritoContext').useCarrito).mockImplementation(mockUseCarritoVacio)
      
      renderWithRouter(<Header />)
      
      const badge = screen.getByText('0')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Accesibilidad', () => {
    it('debería tener atributos de accesibilidad', () => {
      renderWithRouter(<Header />)
      
      const logo = screen.getByAltText('Mil Sabores')
      expect(logo).toBeInTheDocument()
    })

    it('debería ser navegable con teclado', () => {
      renderWithRouter(<Header />)
      
      const inicioLink = screen.getByText('Inicio')
      inicioLink.focus()
      expect(inicioLink).toHaveFocus()
    })
  })

  describe('Manejo de errores', () => {
    it('debería manejar errores en getCurrentUser', () => {
      mockGetCurrentUser.mockImplementation(() => {
        throw new Error('Auth error')
      })
      
      expect(() => {
        renderWithRouter(<Header />)
      }).not.toThrow()
    })

    it('debería manejar errores en el contexto del carrito', () => {
      const mockUseCarritoError = () => {
        throw new Error('Carrito error')
      }
      
      vi.mocked(require('../contexts/CarritoContext').useCarrito).mockImplementation(mockUseCarritoError)
      
      expect(() => {
        renderWithRouter(<Header />)
      }).not.toThrow()
    })
  })
})