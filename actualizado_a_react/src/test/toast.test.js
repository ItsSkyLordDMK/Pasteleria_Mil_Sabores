import { describe, it, expect, beforeEach, vi } from 'vitest'
import { showToast } from '../utils/toast'

describe('Toast Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.dispatchEvent
    global.window.dispatchEvent = vi.fn()
  })

  describe('showToast', () => {
    it('debería disparar evento con tipo y mensaje por defecto', () => {
      showToast()

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'showToast',
          detail: {
            type: 'info',
            message: '',
            opts: {}
          }
        })
      )
    })

    it('debería disparar evento con tipo personalizado', () => {
      showToast('success', 'Operación exitosa')

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'showToast',
          detail: {
            type: 'success',
            message: 'Operación exitosa',
            opts: {}
          }
        })
      )
    })

    it('debería disparar evento con opciones personalizadas', () => {
      const opts = { duration: 5000, position: 'top-right' }
      showToast('error', 'Error ocurrido', opts)

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'showToast',
          detail: {
            type: 'error',
            message: 'Error ocurrido',
            opts: opts
          }
        })
      )
    })

    it('debería manejar diferentes tipos de toast', () => {
      const tipos = ['info', 'success', 'warning', 'error']
      
      tipos.forEach(tipo => {
        showToast(tipo, `Mensaje de ${tipo}`)
        
        expect(window.dispatchEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: expect.objectContaining({
              type: tipo
            })
          })
        )
      })
    })

    it('debería manejar mensajes largos', () => {
      const mensajeLargo = 'Este es un mensaje muy largo que debería ser manejado correctamente por el sistema de toast sin causar problemas de renderizado o overflow en la interfaz de usuario'
      
      showToast('info', mensajeLargo)

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            message: mensajeLargo
          })
        })
      )
    })

    it('debería manejar mensajes con caracteres especiales', () => {
      const mensajeEspecial = 'Mensaje con acentos: áéíóú y símbolos: @#$%&*()'
      
      showToast('info', mensajeEspecial)

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            message: mensajeEspecial
          })
        })
      )
    })

    it('debería manejar mensajes vacíos', () => {
      showToast('info', '')

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            message: ''
          })
        })
      )
    })

    it('debería manejar opciones vacías', () => {
      showToast('info', 'Mensaje', {})

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            opts: {}
          })
        })
      )
    })

    it('debería manejar opciones con múltiples propiedades', () => {
      const opts = {
        duration: 3000,
        position: 'bottom-left',
        closable: true,
        icon: 'check'
      }
      
      showToast('success', 'Éxito', opts)

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            opts: opts
          })
        })
      )
    })

    it('debería manejar errores de dispatchEvent', () => {
      // Mock dispatchEvent para que lance error
      global.window.dispatchEvent = vi.fn().mockImplementation(() => {
        throw new Error('Dispatch error')
      })

      // Mock alert como fallback
      global.alert = vi.fn()

      showToast('error', 'Error de prueba')

      expect(alert).toHaveBeenCalledWith('Error de prueba')
    })

    it('debería manejar cuando dispatchEvent no está disponible', () => {
      // Simular que dispatchEvent no está disponible
      delete global.window.dispatchEvent

      // Mock alert como fallback
      global.alert = vi.fn()

      showToast('error', 'Error de prueba')

      expect(alert).toHaveBeenCalledWith('Error de prueba')
    })

    it('debería manejar cuando alert tampoco está disponible', () => {
      // Simular que ni dispatchEvent ni alert están disponibles
      delete global.window.dispatchEvent
      delete global.alert

      // No debería lanzar error
      expect(() => {
        showToast('error', 'Error de prueba')
      }).not.toThrow()
    })

    it('debería crear evento CustomEvent correctamente', () => {
      showToast('info', 'Mensaje de prueba')

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.any(CustomEvent)
      )
    })

    it('debería manejar tipos de toast inválidos', () => {
      showToast('invalid-type', 'Mensaje')

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            type: 'invalid-type'
          })
        })
      )
    })

    it('debería manejar mensajes null o undefined', () => {
      showToast('info', null)
      showToast('info', undefined)

      expect(window.dispatchEvent).toHaveBeenCalledTimes(2)
    })

    it('debería manejar opciones null o undefined', () => {
      showToast('info', 'Mensaje', null)
      showToast('info', 'Mensaje', undefined)

      expect(window.dispatchEvent).toHaveBeenCalledTimes(2)
    })
  })
})
