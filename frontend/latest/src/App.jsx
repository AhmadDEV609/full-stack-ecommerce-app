import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Protectedpage from "./pages/Protectedpage";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Reset = lazy(() => import("./pages/Reset"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const ProductDetailpage = lazy(() => import("./pages/ProductDetailpage"));
const Cart = lazy(() => import("./pages/Cart"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Order = lazy(() => import("./pages/Order"));
const Orderstatus = lazy(() => import("./pages/Orderstatus"));

const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <p>Loading...</p>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/About" element={<About />} />

          <Route element={<Protectedpage />}>
            <Route path="/product-detail/:id" element={<ProductDetailpage />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/order" element={<Order />} />
            <Route path="/order/status" element={<Orderstatus />} />
          </Route>
        </Routes>
      </Suspense>

      <Footer />
    </BrowserRouter>
  );
};

export default App;