import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { useAuthStore } from './store/authstore' 
// import Login from './pages/Login'
// import Dashboard from './pages/Dashboard'
import AppRoutes from './routes/index'

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/dashboard" element={
    //       <PrivateRoute>
    //         <Dashboard />
    //       </PrivateRoute>
    //     } />
    //     <Route path="*" element={<Navigate to="/login" />} />
    //   </Routes>
    // </BrowserRouter>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App