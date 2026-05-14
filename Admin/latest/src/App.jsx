import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Protected from './pages/Protected'
const Login = lazy(() => import('./pages/Login'))
const Admin = lazy(() => import('./pages/Admin'))
const Analytics = lazy(() => import('./pages/Analytics'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const Orders = lazy(() => import('./pages/Orders'))
const ProductUpdate = lazy(() => import('./pages/ProductUpdate'))

const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <p>Loading...</p>
  </div>
)

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Protected />}>
            <Route path="/" element={<Admin />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/order" element={<Orders />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/update/:id" element={<ProductUpdate />} />
          </Route>
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  )
}

export default App