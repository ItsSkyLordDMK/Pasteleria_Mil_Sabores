import { describe, it, expect, beforeEach, vi } from 'vitest'
import authUtils from '../utils/auth'

const {
  login,
  logout,
  getCurrentUser,
  addUser,
  isLoggedIn,
  setSession,
  getSession
} = authUtils

describe('Auth Utils', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('addUser', () => {
    it('debería agregar un usuario correctamente', () => {
      const user = {
        correo: 'test@test.com',
        password: 'password123',
        nombre: 'Test User'
      }

      const result = addUser(user)
      expect(result.ok).toBe(true)
    })

    it('debería fallar si el usuario ya existe', () => {
      const user = {
        correo: 'test@test.com',
        password: 'password123',
        nombre: 'Test User'
      }

      addUser(user)
      const result = addUser(user)
      expect(result.ok).toBe(false)
      expect(result.message).toContain('ya existe')
    })

    it('debería fallar si faltan campos requeridos', () => {
      const user = {
        correo: 'test@test.com'
        // Falta password y nombre
      }

      const result = addUser(user)
      expect(result.ok).toBe(false)
    })
  })

  describe('login', () => {
    beforeEach(() => {
      addUser({
        correo: 'test@test.com',
        password: 'password123',
        nombre: 'Test User'
      })
    })

    it('debería hacer login correctamente', () => {
      const result = login('test@test.com', 'password123')
      expect(result.ok).toBe(true)
      expect(result.user).toBeDefined()
    })

    it('debería fallar con credenciales incorrectas', () => {
      const result = login('test@test.com', 'wrongpassword')
      expect(result.ok).toBe(false)
      expect(result.message).toContain('incorrecta')
    })

    it('debería fallar si el usuario no existe', () => {
      const result = login('nonexistent@test.com', 'password123')
      expect(result.ok).toBe(false)
      expect(result.message).toContain('no encontrado')
    })

    it('debería establecer isAdmin para correos @profesor.duoc.cl', () => {
      addUser({
        correo: 'profesor@profesor.duoc.cl',
        password: 'password123',
        nombre: 'Profesor'
      })

      const result = login('profesor@profesor.duoc.cl', 'password123')
      expect(result.ok).toBe(true)
      
      const session = getSession()
      expect(session.isAdmin).toBe(true)
    })
  })

  describe('logout', () => {
    it('debería limpiar la sesión', () => {
      setSession({ correo: 'test@test.com', nombre: 'Test', isAdmin: false })
      expect(isLoggedIn()).toBe(true)
      
      logout()
      expect(isLoggedIn()).toBe(false)
    })
  })

  describe('getCurrentUser', () => {
    it('debería retornar null si no hay sesión', () => {
      const user = getCurrentUser()
      expect(user).toBeNull()
    })

    it('debería retornar el usuario actual', () => {
      addUser({
        correo: 'test@test.com',
        password: 'password123',
        nombre: 'Test User'
      })
      
      login('test@test.com', 'password123')
      const user = getCurrentUser()
      
      expect(user).toBeDefined()
      expect(user.correo).toBe('test@test.com')
    })
  })

  describe('isLoggedIn', () => {
    it('debería retornar false si no hay sesión', () => {
      expect(isLoggedIn()).toBe(false)
    })

    it('debería retornar true si hay sesión activa', () => {
      setSession({ correo: 'test@test.com', nombre: 'Test', isAdmin: false })
      expect(isLoggedIn()).toBe(true)
    })
  })

  describe('setSession y getSession', () => {
    it('debería establecer y obtener la sesión correctamente', () => {
      const sessionData = {
        correo: 'test@test.com',
        nombre: 'Test User',
        isAdmin: false
      }

      setSession(sessionData)
      const session = getSession()

      expect(session).toEqual(sessionData)
    })

    it('debería manejar errores de localStorage', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error')
      })

      const result = setSession({ correo: 'test@test.com' })
      expect(result).toBe(false)
    })
  })
})
