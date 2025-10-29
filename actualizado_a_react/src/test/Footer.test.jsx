import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Footer from '../components/Footer'

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Footer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado', () => {
    it('debería renderizar el footer', () => {
      renderWithRouter(<Footer />)
      
      expect(screen.getByText(/pastelería mil sabores/i)).toBeInTheDocument()
    })

    it('debería mostrar enlaces de navegación', () => {
      renderWithRouter(<Footer />)
      
      expect(screen.getByText('Inicio')).toBeInTheDocument()
      expect(screen.getByText('Productos')).toBeInTheDocument()
      expect(screen.getByText('Categorías')).toBeInTheDocument()
      expect(screen.getByText('Nosotros')).toBeInTheDocument()
      expect(screen.getByText('Contacto')).toBeInTheDocument()
    })

    it('debería mostrar sección de newsletter', () => {
      renderWithRouter(<Footer />)
      
      expect(screen.getByText(/suscríbete/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/tu correo/i)).toBeInTheDocument()
    })
  })

  describe('Enlaces de navegación', () => {
    it('debería tener enlaces correctos', () => {
      renderWithRouter(<Footer />)
      
      expect(screen.getByText('Inicio').closest('a')).toHaveAttribute('href', '/')
      expect(screen.getByText('Productos').closest('a')).toHaveAttribute('href', '/productos')
      expect(screen.getByText('Categorías').closest('a')).toHaveAttribute('href', '/categorias')
      expect(screen.getByText('Nosotros').closest('a')).toHaveAttribute('href', '/nosotros')
      expect(screen.getByText('Contacto').closest('a')).toHaveAttribute('href', '/contacto')
    })
  })

  describe('Newsletter', () => {
    it('debería mostrar campo de email', () => {
      renderWithRouter(<Footer />)
      
      const emailInput = screen.getByPlaceholderText(/tu correo/i)
      expect(emailInput).toBeInTheDocument()
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('debería mostrar botón de suscripción', () => {
      renderWithRouter(<Footer />)
      
      const subscribeButton = screen.getByText(/suscribirse/i)
      expect(subscribeButton).toBeInTheDocument()
    })
  })

  describe('Accesibilidad', () => {
    it('debería tener estructura semántica correcta', () => {
      renderWithRouter(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
    })

    it('debería tener labels correctos', () => {
      renderWithRouter(<Footer />)
      
      const emailInput = screen.getByPlaceholderText(/tu correo/i)
      expect(emailInput).toHaveAttribute('type', 'email')
    })
  })
})
