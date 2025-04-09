import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext)
  return token ? children : <Navigate to="/" replace />
}