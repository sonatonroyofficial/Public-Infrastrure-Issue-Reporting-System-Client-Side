import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // Check if user is logged in on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setToken(token);
            setUser(user);

            return { success: true, user };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed. Please try again.'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setToken(token);
            setUser(user);

            return { success: true, user };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed. Please try again.'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const isAuthenticated = !!token && !!user;
    const isAdmin = user?.role === 'admin';
    const isStaff = user?.role === 'staff';
    const isCitizen = user?.role === 'citizen';
    const isPremium = user?.isPremium === true;

    const value = {
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        isStaff,
        isCitizen,
        isPremium,
        login,
        register,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
