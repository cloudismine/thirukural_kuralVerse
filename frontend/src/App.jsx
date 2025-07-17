import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import Layout from './components/Layout';
import Header from './components/Header';
import Home from './pages/Home';
import KuralList from './pages/KuralList';
import KuralDetail from './pages/KuralDetail';
import CategoryView from './pages/CategoryView';
import Search from './pages/Search';
import Chat from './pages/Chat';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-manuscript-50 via-palmleaf-50 to-manuscript-100 text-palmleaf-900">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="kurals" element={<KuralList />} />
                <Route path="kural/:number" element={<KuralDetail />} />
                <Route path="category/:paal" element={<CategoryView />} />
                <Route path="adhigaram/:adhigaram" element={<CategoryView />} />
                <Route path="search" element={<Search />} />
                <Route path="chat" element={<Chat />} />
                <Route path="about" element={<About />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                {/* Protected routes */}
                <Route path="profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="favorites" element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } />

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
