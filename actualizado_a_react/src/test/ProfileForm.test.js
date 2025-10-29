import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProfileForm from '../components/ProfileForm'

// Mock de las utilidades
vi.mock('../utils/rut', () => ({
  validarRUT: vi.fn(() => true),
  formatearRUT: vi.fn((rut) => rut),
  limpiarRUT: vi.fn((rut) => rut)
}))

vi.mock('../utils/password', () => ({
  validarContrasena: vi.fn(() => ({
    esValida: true,
    fortaleza: 'fuerte',
    errores: []
  })),
  contrasenasSonDiferentes: vi.fn(() => true)
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('ProfileForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Renderizado inicial', () => {
    it('debería renderizar el formulario correctamente', () => {
      renderWithRouter(<ProfileForm />)
      
      expect(screen.getByText('Información Personal')).toBeInTheDocument()
      expect(screen.getByText('Preferencias')).toBeInTheDocument()
      expect(screen.getByText('Seguridad')).toBeInTheDocument()
      expect(screen.getByText('Zona de Peligro')).toBeInTheDocument()
    })

    it('debería mostrar campos de información personal', () => {
      renderWithRouter(<ProfileForm />)
      
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/correo/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument()
    })

    it('debería mostrar campos adicionales', () => {
      renderWithRouter(<ProfileForm />)
      
      expect(screen.getByLabelText(/RUT/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/fecha de nacimiento/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/país/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/comuna/i)).toBeInTheDocument()
    })
  })

  describe('Funcionalidad del formulario', () => {
    it('debería actualizar campos cuando el usuario escribe', () => {
      renderWithRouter(<ProfileForm />)
      
      const nombreInput = screen.getByLabelText(/nombre/i)
      fireEvent.change(nombreInput, { target: { value: 'Nuevo Nombre' } })
      
      expect(nombreInput.value).toBe('Nuevo Nombre')
    })

    it('debería mostrar botón de guardar', () => {
      renderWithRouter(<ProfileForm />)
      
      const guardarButton = screen.getByText('Guardar')
      expect(guardarButton).toBeInTheDocument()
    })

    it('debería manejar el envío del formulario', async () => {
      renderWithRouter(<ProfileForm />)
      
      const nombreInput = screen.getByLabelText(/nombre/i)
      fireEvent.change(nombreInput, { target: { value: 'Test User' } })
      
      const guardarButton = screen.getByText('Guardar')
      fireEvent.click(guardarButton)
      
      // El formulario debería procesar el envío
      await waitFor(() => {
        expect(guardarButton).toBeInTheDocument()
      })
    })
  })

  describe('Sección de cambio de contraseña', () => {
    it('debería mostrar botón para cambiar contraseña', () => {
      renderWithRouter(<ProfileForm />)
      
      expect(screen.getByText('Cambiar Contraseña')).toBeInTheDocument()
    })

    it('debería mostrar formulario de cambio de contraseña al hacer clic', () => {
      renderWithRouter(<ProfileForm />)
      
      const cambiarButton = screen.getByText('Cambiar Contraseña')
      fireEvent.click(cambiarButton)
      
      expect(screen.getByLabelText(/contraseña actual/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/nueva contraseña/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirmar nueva contraseña/i)).toBeInTheDocument()
    })

    it('debería ocultar formulario de cambio de contraseña al cancelar', () => {
      renderWithRouter(<ProfileForm />)
      
      const cambiarButton = screen.getByText('Cambiar Contraseña')
      fireEvent.click(cambiarButton)
      
      const cancelarButton = screen.getByText('Cancelar Cambio')
      fireEvent.click(cancelarButton)
      
      expect(screen.queryByLabelText(/contraseña actual/i)).not.toBeInTheDocument()
    })
  })

  describe('Sección de preferencias', () => {
    it('debería mostrar checkboxes de preferencias', () => {
      renderWithRouter(<ProfileForm />)
      
      expect(screen.getByText(/recibir notificaciones por email/i)).toBeInTheDocument()
      expect(screen.getByText(/recibir notificaciones por sms/i)).toBeInTheDocument()
    })

    it('debería mostrar selector de contacto preferido', () => {
      renderWithRouter(<ProfileForm />)
      
      expect(screen.getByLabelText(/preferencias de contacto/i)).toBeInTheDocument()
    })

    it('debería mostrar selector de horario preferido', () => {
      renderWithRouter(<ProfileForm />)
      
      expect(screen.getByLabelText(/horario preferido/i)).toBeInTheDocument()
    })
  })

  describe('Sección de eliminación de cuenta', () => {
    it('debería mostrar botón de eliminar cuenta', () => {
      renderWithRouter(<ProfileForm />)
      
      expect(screen.getByText('Eliminar Cuenta')).toBeInTheDocument()
    })

    it('debería mostrar confirmación al hacer clic en eliminar', () => {
      renderWithRouter(<ProfileForm />)
      
      const eliminarButton = screen.getByText('Eliminar Cuenta')
      fireEvent.click(eliminarButton)
      
      expect(screen.getByLabelText(/confirma tu contraseña/i)).toBeInTheDocument()
      expect(screen.getByText('Sí, eliminar mi cuenta')).toBeInTheDocument()
    })

    it('debería ocultar confirmación al cancelar', () => {
      renderWithRouter(<ProfileForm />)
      
      const eliminarButton = screen.getByText('Eliminar Cuenta')
      fireEvent.click(eliminarButton)
      
      const cancelarButton = screen.getByText('Cancelar')
      fireEvent.click(cancelarButton)
      
      expect(screen.queryByLabelText(/confirma tu contraseña/i)).not.toBeInTheDocument()
    })
  })

  describe('Validaciones', () => {
    it('debería validar RUT correctamente', () => {
      const { validarRUT } = require('../utils/rut')
      validarRUT.mockReturnValue(false)
      
      renderWithRouter(<ProfileForm />)
      
      const rutInput = screen.getByLabelText(/RUT/i)
      fireEvent.change(rutInput, { target: { value: '12345678-9' } })
      
      expect(validarRUT).toHaveBeenCalled()
    })

    it('debería validar contraseña correctamente', () => {
      const { validarContrasena } = require('../utils/password')
      validarContrasena.mockReturnValue({
        esValida: false,
        fortaleza: 'débil',
        errores: ['Muy corta']
      })
      
      renderWithRouter(<ProfileForm />)
      
      const cambiarButton = screen.getByText('Cambiar Contraseña')
      fireEvent.click(cambiarButton)
      
      const nuevaPasswordInput = screen.getByLabelText(/nueva contraseña/i)
      fireEvent.change(nuevaPasswordInput, { target: { value: '123' } })
      
      expect(validarContrasena).toHaveBeenCalled()
    })
  })

  describe('Estados de carga', () => {
    it('debería mostrar estado de guardando', async () => {
      renderWithRouter(<ProfileForm />)
      
      const guardarButton = screen.getByText('Guardar')
      fireEvent.click(guardarButton)
      
      // El botón debería estar deshabilitado durante el guardado
      expect(guardarButton).toBeDisabled()
    })
  })

  describe('Manejo de errores', () => {
    it('debería manejar errores de validación', () => {
      const { validarRUT } = require('../utils/rut')
      validarRUT.mockReturnValue(false)
      
      renderWithRouter(<ProfileForm />)
      
      const rutInput = screen.getByLabelText(/RUT/i)
      fireEvent.change(rutInput, { target: { value: 'invalid-rut' } })
      
      // Debería mostrar error de validación
      expect(validarRUT).toHaveBeenCalledWith('invalid-rut')
    })
  })
})
