// "use client"

// import { useState, useEffect, createContext, useContext } from "react"
// import { authAPI } from "../utils/api"

// const AuthContext = createContext()

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     checkAuthStatus()
//   }, [])

//   const checkAuthStatus = async () => {
//     try {
//       const token = localStorage.getItem("token")
//       if (token) {
//         const response = await authAPI.getProfile()
//         setUser(response.data.user)
//         setIsAuthenticated(true)
//       }
//     } catch (error) {
//       localStorage.removeItem("token")
//       setUser(null)
//       setIsAuthenticated(false)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const login = async (credentials) => {
//     try {
//       const response = await authAPI.login(credentials)
//       const { token, user } = response.data

//       localStorage.setItem("token", token)
//       setUser(user)
//       setIsAuthenticated(true)

//       return { success: true, user }
//     } catch (error) {
//       return { success: false, error: error.message }
//     }
//   }

//   const logout = async () => {
//     try {
//       await authAPI.logout()
//     } catch (error) {
//       console.error("Logout error:", error)
//     } finally {
//       localStorage.removeItem("token")
//       setUser(null)
//       setIsAuthenticated(false)
//     }
//   }

//   const value = {
//     user,
//     isAuthenticated,
//     loading,
//     login,
//     logout,
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// import { createContext, useContext, useState, useEffect } from 'react'
// import { authAPI } from '../utils/api'

// const AuthContext = createContext()

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)

//   useEffect(() => {
//     checkAuthStatus()
//   }, [])

//   const checkAuthStatus = async () => {
//     try {
//       const token = localStorage.getItem('token')
//       if (token) {
//         // Verify token is still valid
//         const userData = await authAPI.getProfile()
//         setUser(userData.data || userData)
//         setIsAuthenticated(true)
//       }
//     } catch (error) {
//       // Token is invalid, clear it
//       localStorage.removeItem('token')
//       localStorage.removeItem('user')
//       setUser(null)
//       setIsAuthenticated(false)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const login = async (credentials) => {
//     try {
//       const response = await authAPI.login(credentials)
//       const { token, user: userData } = response.data || response
      
//       localStorage.setItem('token', token)
//       localStorage.setItem('user', JSON.stringify(userData))
      
//       setUser(userData)
//       setIsAuthenticated(true)
      
//       return { success: true, user: userData }
//     } catch (error) {
//       console.error('Login error:', error)
//       return { success: false, error: error.message }
//     }
//   }

//   const signup = async (userData) => {
//     try {
//       const response = await authAPI.signup(userData)
//       const { token, user: newUser } = response.data || response
      
//       localStorage.setItem('token', token)
//       localStorage.setItem('user', JSON.stringify(newUser))
      
//       setUser(newUser)
//       setIsAuthenticated(true)
      
//       return { success: true, user: newUser }
//     } catch (error) {
//       console.error('Signup error:', error)
//       return { success: false, error: error.message }
//     }
//   }

//   const logout = async () => {
//     try {
//       await authAPI.logout()
//     } catch (error) {
//       console.error('Logout error:', error)
//     } finally {
//       localStorage.removeItem('token')
//       localStorage.removeItem('user')
//       setUser(null)
//       setIsAuthenticated(false)
//     }
//   }

//   const value = {
//     user,
//     loading,
//     isAuthenticated,
//     login,
//     signup,
//     logout,
//     checkAuthStatus
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../utils/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        // Verify token is still valid
        const userData = await authAPI.getProfile()
        setUser(userData.data || userData)
        setIsAuthenticated(true)
      }
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      const { token, user: userData } = response.data || response

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))

      setUser(userData)
      setIsAuthenticated(true)

      return { success: true, user: userData }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: error.message }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData)
      const { token, user: newUser } = response.data || response

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(newUser))

      setUser(newUser)
      setIsAuthenticated(true)

      return { success: true, user: newUser }
    } catch (error) {
      console.error("Signup error:", error)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    checkAuthStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
