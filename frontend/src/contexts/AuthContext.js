"use client"

import { createContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedUser = jwt.decode(token);
            setCurrentUser(decodedUser);
        }
    }, []);

    const login = (user, token) => {
        localStorage.setItem("token", token);
        setCurrentUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
