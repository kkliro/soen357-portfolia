import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage'
import LandingPage from './pages/landingPage'
import LoginPage from './pages/loginPage'
// import CreateAccountPage from './pages/createAccountPage'
import { AuthProvider } from './context/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/signup" element={<CreateAccountPage />} /> */}
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App