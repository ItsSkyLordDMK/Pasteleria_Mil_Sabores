import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

// Mock de las utilidades de autenticación
const mockLogin = vi.fn()
const mockAddUser = vi.fn()

vi.mock('../utils/auth', () => ({
  login: mockLogin,
  addUser: mockAddUser
}))

// Mock de toast
const mockShowToast = vi.fn()
vi.mock('../utils/toast', () => ({
  showToast: mockShowToast
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado inicial', () => {
    it('debería renderizar el formulario de login', () => {
      renderWithRouter(<LoginForm />)
      
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
    })

    it('debería mostrar enlace para registrarse', () => {
      renderWithRouter(<LoginForm />)
      
      expect(screen.getByText('¿No tienes cuenta?')).toBeInTheDocument()
      expect(screen.getByText('Regístrate aquí')).toBeInTheDocument()
    })
  })

  describe('Formulario de login', () => {
    it('debería actualizar campos cuando el usuario escribe', () => {
      renderWithRouter(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/correo electrónico/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)
      
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      
      expect(emailInput.value).toBe('test@test.com')
      expect(passwordInput.value).toBe('password123')
    })

    it('debería enviar formulario con datos correctos', async () => {
      mockLogin.mockResolvedValue({ ok: true, user: { correo: 'test@test.com' } })
      
      renderWithRouter(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/correo electrónico/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123')
      })
    })

    it('debería mostrar error si el login falla', async () => {
      mockLogin.mockResolvedValue({ ok: false, message: 'Credenciales incorrectas' })
      
      renderWithRouter(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/correo electrónico/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('error', 'Credenciales incorrectas')
      })
    })
  })

  describe('Formulario de registro', () => {
    it('debería cambiar a modo registro al hacer clic en enlace', () => {
      renderWithRouter(<LoginForm />)
      
      const registerLink = screen.getByText('Regístrate aquí')
      fireEvent.click(registerLink)
      
      expect(screen.getByText('Crear Cuenta')).toBeInTheDocument()
      expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument()
    })

    it('debería mostrar formulario de registro completo', () => {
      renderWithRouter(<LoginForm />)
      
      const registerLink = screen.getByText('Regístrate aquí')
      fireEvent.click(registerLink)
      
      expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument()
    })

    it('debería validar que las contraseñas coincidan', async () => {
      renderWithRouter(<LoginForm />)
      
      const registerLink = screen.getByText('Regístrate aquí')
      fireEvent.click(registerLink)
      
      const passwordInput = screen.getByLabelText(/contraseña/i)
      const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i)
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('error', 'Las contraseñas no coinciden')
      })
    })

    it('debería crear usuario correctamente', async () => {
      mockAddUser.mockResolvedValue({ ok: true })
      
      renderWithRouter(<LoginForm />)
      
      const registerLink = screen.getByText('Regístrate aquí')
      fireEvent.click(registerLink)
      
      const nameInput = screen.getByLabelText(/nombre completo/i)
      const emailInput = screen.getByLabelText(/correo electrónico/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)
      const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i)
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
      
      fireEvent.change(nameInput, { target: { value: 'Test User' } })
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockAddUser).toHaveBeenCalledWith({
          nombre: 'Test User',
          correo: 'test@test.com',
          password: 'password123'
        })
      })
    })
  })

  describe('Validaciones', () => {
    it('debería validar campos requeridos en login', async () => {
      renderWithRouter(<LoginForm />)
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('error', 'Por favor completa todos los campos')
      })
    })

    it('debería validar formato de email', async () => {
      renderWithRouter(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/correo electrónico/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('error', 'Por favor ingresa un email válido')
      })
    })

    it('debería validar campos requeridos en registro', async () => {
      renderWithRouter(<LoginForm />)
      
      const registerLink = screen.getByText('Regístrate aquí')
      fireEvent.click(registerLink)
      
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('error', 'Por favor completa todos los campos')
      })
    })
  })

  describe('Estados de carga', () => {
    it('debería mostrar estado de carga durante login', async () => {
      mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100)))
      
      renderWithRouter(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/correo electrónico/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      expect(submitButton).toBeDisabled()
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled()
      })
    })

    it('debería mostrar estado de carga durante registro', async () => {
      mockAddUser.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100)))
      
      renderWithRouter(<LoginForm />)
      
      const registerLink = screen.getByText('Regístrate aquí')
      fireEvent.click(registerLink)
      
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
      fireEvent.click(submitButton)
      
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Navegación', () => {
    it('debería cambiar entre login y registro', () => {
      renderWithRouter(<LoginForm />)
      
      // Inicialmente en modo login
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
      
      // Cambiar a registro
      const registerLink = screen.getByText('Regístrate aquí')
      fireEvent.click(registerLink)
      
      expect(screen.getByText('Crear Cuenta')).toBeInTheDocument()
      
      // Volver a login
      const loginLink = screen.getByText('¿Ya tienes cuenta?')
      fireEvent.click(loginLink)
      
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
    })
  })

  describe('Accesibilidad', () => {
    it('debería tener labels correctos', () => {
      renderWithRouter(<LoginForm />)
      
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    })

    it('debería ser navegable con teclado', () => {
      renderWithRouter(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/correo electrónico/i)
      emailInput.focus()
      expect(emailInput).toHaveFocus()
    })
  })

  describe('Manejo de errores', () => {
    it('debería manejar errores de red', async () => {
      mockLogin.mockRejectedValue(new Error('Network error'))
      
      renderWithRouter(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/correo electrónico/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('error', 'Error de conexión')
      })
    })
  })
})
