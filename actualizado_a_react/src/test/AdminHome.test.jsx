import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AdminHome from '../pages/admin/AdminHome'

// Mock de las utilidades
vi.mock('../utils/products', () => ({
  getStoredProducts: vi.fn(() => [
    { id: '1', nombre: 'Producto 1', precio: 1000, stock: 10 },
    { id: '2', nombre: 'Producto 2', precio: 2000, stock: 5 }
  ])
}))

vi.mock('../utils/orders', () => ({
  getStoredOrders: vi.fn(() => [
    { id: '1', usuario: 'test@test.com', total: 1000, estado: 'pendiente' },
    { id: '2', usuario: 'test2@test.com', total: 2000, estado: 'confirmada' }
  ])
}))

vi.mock('../utils/auth', () => ({
  getUsers: vi.fn(() => [
    { correo: 'test@test.com', nombre: 'Test User' },
    { correo: 'test2@test.com', nombre: 'Test User 2' }
  ])
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('AdminHome Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado', () => {
    it('debería renderizar la página de admin', () => {
      renderWithRouter(<AdminHome />)
      
      expect(screen.getByText(/panel de administración/i)).toBeInTheDocument()
    })

    it('debería mostrar estadísticas', () => {
      renderWithRouter(<AdminHome />)
      
      expect(screen.getByText(/estadísticas/i)).toBeInTheDocument()
    })

    it('debería mostrar enlaces de administración', () => {
      renderWithRouter(<AdminHome />)
      
      expect(screen.getByText(/gestionar productos/i)).toBeInTheDocument()
      expect(screen.getByText(/gestionar órdenes/i)).toBeInTheDocument()
      expect(screen.getByText(/gestionar usuarios/i)).toBeInTheDocument()
    })
  })

  describe('Estadísticas', () => {
    it('debería mostrar estadísticas de productos', () => {
      renderWithRouter(<AdminHome />)
      
      expect(screen.getByText(/total de productos/i)).toBeInTheDocument()
    })

    it('debería mostrar estadísticas de órdenes', () => {
      renderWithRouter(<AdminHome />)
      
      expect(screen.getByText(/total de órdenes/i)).toBeInTheDocument()
    })

    it('debería mostrar estadísticas de usuarios', () => {
      renderWithRouter(<AdminHome />)
      
      expect(screen.getByText(/total de usuarios/i)).toBeInTheDocument()
    })
  })

  describe('Enlaces de administración', () => {
    it('debería tener enlaces correctos', () => {
      renderWithRouter(<AdminHome />)
      
      expect(screen.getByText(/gestionar productos/i).closest('a')).toHaveAttribute('href', '/admin/productos')
      expect(screen.getByText(/gestionar órdenes/i).closest('a')).toHaveAttribute('href', '/admin/ordenes')
      expect(screen.getByText(/gestionar usuarios/i).closest('a')).toHaveAttribute('href', '/admin/usuarios')
    })
  })

  describe('Accesibilidad', () => {
    it('debería tener estructura semántica correcta', () => {
      renderWithRouter(<AdminHome />)
      
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('debería tener headings jerárquicos', () => {
      renderWithRouter(<AdminHome />)
      
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })
  })

  describe('Manejo de errores', () => {
    it('debería manejar errores al cargar datos', () => {
      const { getStoredProducts } = require('../utils/products')
      getStoredProducts.mockImplementation(() => {
        throw new Error('Error loading products')
      })
      
      expect(() => {
        renderWithRouter(<AdminHome />)
      }).not.toThrow()
    })
  })
})
