"use client"

import { createContext, useContext, useState, useEffect } from "react";
import { ref, onValue, push } from "firebase/database";
import { database } from "./firebase";

// Create a context
const DatabaseContext = createContext();

// Provide the context
export const DatabaseProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const messagesRef = ref(database, "messages");
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const messagesArray = data ? Object.values(data) : [];
            setMessages(messagesArray);
        });
    }, []);

    const sendMessage = (message) => {
        const messagesRef = ref(database, "messages");
        push(messagesRef, message);
    };

    return (
        <DatabaseContext.Provider value={{ messages, sendMessage }}>
            {children}
        </DatabaseContext.Provider>
    );
};

// Custom hook for using the context
export const useDatabase = () => {
    return useContext(DatabaseContext);
};
