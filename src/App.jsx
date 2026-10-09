import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { MotionProvider } from './context/MotionContext.jsx';
import { MotionControllerProvider } from './hooks/useMotionController.jsx';
import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { MotionHUD } from './components/motion/MotionHUD.jsx';
import { VirtualCursor } from './components/motion/VirtualCursor.jsx';
import { VoiceControl } from './components/motion/VoiceControl.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { RestaurantsPage } from './pages/RestaurantsPage.jsx';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { ConfirmationPage } from './pages/ConfirmationPage.jsx';
import { MotionHelpPage } from './pages/MotionHelpPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const handleMotionNavigation = (event) => {
      const direction = event.detail?.direction;

      if (direction === 'back') {
        navigate(-1);
        return;
      }

      if (direction === 'next') {
        if (location.pathname === '/') {
          navigate('/restaurants');
          return;
        }

        navigate(1);
      }
    };

    window.addEventListener(
      'motioneats:navigation',
      handleMotionNavigation
    );

    return () => {
      window.removeEventListener(
        'motioneats:navigation',
        handleMotionNavigation
      );
    };
  }, [navigate, location.pathname]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/motion-help" element={<MotionHelpPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      {/* Motion control overlays */}
      <MotionHUD />
      <VirtualCursor />
      <VoiceControl />
    </>
  );
}

function NotFound() {
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center', gap: 16 }}>
      <span style={{ fontSize: 64 }}>🍽️</span>
      <h2 style={{ fontSize: 28, fontWeight: 800 }}>Page not found</h2>
      <a href="/" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Go home</a>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MotionProvider>
        <MotionControllerProvider>
          <CartProvider>
            <AppLayout />
          </CartProvider>
        </MotionControllerProvider>
      </MotionProvider>
    </BrowserRouter>
  );
}
