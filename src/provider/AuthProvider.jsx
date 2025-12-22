import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Simulate auth check
    useEffect(() => {
        // Check local storage for token/user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const createUser = (email, password) => {
        setLoading(true);
        // API call here
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = {
                    email,
                    displayName: "Citizen One",
                    photoURL: "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
                    role: 'citizen'
                };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                setLoading(false);
                resolve(newUser);
            }, 1000);
        });
    };

    const signIn = (email, password) => {
        setLoading(true);
        // API call here
        return new Promise((resolve) => {
            setTimeout(() => {
                const loggedUser = {
                    email,
                    displayName: "Citizen One",
                    photoURL: "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
                    role: 'citizen'
                };
                setUser(loggedUser);
                localStorage.setItem('user', JSON.stringify(loggedUser));
                setLoading(false);
                resolve(loggedUser);
            }, 1000);
        });
    };

    const logOut = () => {
        setLoading(true);
        return new Promise((resolve) => {
            setUser(null);
            localStorage.removeItem('user');
            setLoading(false);
            resolve();
        });
    };

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        logOut
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
