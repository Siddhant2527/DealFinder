import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import { useAuth } from './context/AuthContext.jsx';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Main />
            </CartProvider>
        </AuthProvider>
    );
}

const Main = () => {
    const { user } = useAuth();
    return user ? <HomePage /> : <LoginPage />;
};

export default App;
