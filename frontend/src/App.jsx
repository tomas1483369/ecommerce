import { lazy, Suspense } from 'react';
import { useAuth } from '@clerk/react';
import PageLoader from './components/PageLoader';
import Layout from './components/Layout';
import { Routes, Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage';

// every page except the home page is loaded on demand
const CartPage = lazy(() => import('./pages/CartPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const CheckoutReturnPage = lazy(() => import('./pages/CheckoutReturnPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const OrderSummaryPage = lazy(() => import('./pages/OrderSummaryPage'));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));

function App() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <PageLoader />;

  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route
            path="/orders"
            element={isSignedIn ? <OrdersPage /> : <Navigate to={'/'} replace />}
          />
          <Route path="/checkout/return" element={<CheckoutReturnPage />} />

          <Route
            path="/admin"
            element={isSignedIn ? <AdminProductsPage /> : <Navigate to="/" replace />}
          />

          {/* NESTED ROUTES */}
          <Route path="/orders/:id" element={<OrderDetailPage />}>
            <Route index element={<OrderSummaryPage />} />
          </Route>

          {/* informational pages content is pending */}
          <Route path="/categoria/:slug" element={<CategoryPage />} />
          <Route path="/informacion/:slug" element={<PlaceholderPage kind="info" />} />
          <Route path="*" element={<PlaceholderPage kind="notFound" />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
