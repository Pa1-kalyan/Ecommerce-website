
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './service/Guard';
import Navbar from './component/common/Navbar';
import Footer from './component/common/footer';
import { CartProvider } from './component/context/CartContext';
import React, { Suspense } from 'react';

// Lazy loading components
const Home = React.lazy(() => import('./component/pages/Home'));
const ProductDetailsPage = React.lazy(() => import('./component/pages/ProductDetailsPage'));
const CategoryListPage = React.lazy(() => import('./component/pages/CategoryListPage'));
const CategoryProductsPage = React.lazy(() => import('./component/pages/CategoryProductsPage'));
const CartPage = React.lazy(() => import('./component/pages/CartPage'));
const RegisterPage = React.lazy(() => import('./component/pages/RegisterPage'));
const LoginPage = React.lazy(() => import('./component/pages/LoginPage'));
const ProfilePage = React.lazy(() => import('./component/pages/ProfilePage'));
const AddressPage = React.lazy(() => import('./component/pages/AddressPage'));
const AdminPage = React.lazy(() => import('./component/admin/AdminPage'));
const AdminCategoryPage = React.lazy(() => import('./component/admin/AdminCategoryPage'));
const AddCategory = React.lazy(() => import('./component/admin/AddCategory'));
const EditCategory = React.lazy(() => import('./component/admin/EditCategory'));
const AdminProductPage = React.lazy(() => import('./component/admin/AdminProductPage'));
const AddProductPage = React.lazy(() => import('./component/admin/AddProductPage'));
const EditProductPage = React.lazy(() => import('./component/admin/EditProductPage'));
const AdminOrdersPage = React.lazy(() => import('./component/admin/AdminOrderPage'));
const AdminOrderDetailsPage = React.lazy(() => import('./component/admin/AdminOrderDetailsPage'));

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="spinner"></div> {/* Apply simple animation locally or via existing css */}
    Loading...
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* OUR ROUTES */}
            <Route exact path='/' element={<Home />} />
            <Route path='/product/:productId' element={<ProductDetailsPage />} />
            <Route path='/categories' element={<CategoryListPage />} />
            <Route path='/category/:categoryId' element={<CategoryProductsPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/login' element={<LoginPage />} />

            <Route path='/profile' element={<ProtectedRoute element={<ProfilePage />} />} />
            <Route path='/add-address' element={<ProtectedRoute element={<AddressPage />} />} />
            <Route path='/edit-address' element={<ProtectedRoute element={<AddressPage />} />} />


            <Route path='/admin' element={<AdminRoute element={<AdminPage />} />} />
            <Route path='/admin/categories' element={<AdminRoute element={<AdminCategoryPage />} />} />
            <Route path='/admin/add-category' element={<AdminRoute element={<AddCategory />} />} />
            <Route path='/admin/edit-category/:categoryId' element={<AdminRoute element={<EditCategory />} />} />
            <Route path='/admin/products' element={<AdminRoute element={<AdminProductPage />} />} />
            <Route path='/admin/add-product' element={<AdminRoute element={<AddProductPage />} />} />
            <Route path='/admin/edit-product/:productId' element={<AdminRoute element={<EditProductPage />} />} />

            <Route path='/admin/orders' element={<AdminRoute element={<AdminOrdersPage />} />} />
            <Route path='/admin/order-details/:itemId' element={<AdminRoute element={<AdminOrderDetailsPage />} />} />


          </Routes>
        </Suspense>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
