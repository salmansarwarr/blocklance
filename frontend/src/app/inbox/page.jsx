"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { AuthContext } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { getOfferByUser, getUserByEmail, getUserById } from "@/utils/api";
import { useSelector } from "react-redux";
import "./style.css";
import Loader from "@/components/Loader";

const Inbox = () => {
    const database = getDatabase();
    const [interactions, setInteractions] = useState([]);
    const { user } = useSelector((state) => state.authReducer);
    const router = useRouter();
    const [names, setNames] = useState({});
    const [pictures, setPictures] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        const messagesRef = ref(database, "messages");
        const handleValueChange = async (snapshot) => {
            const messagesData = snapshot.val();
            let messages = [];

            if (messagesData) {
                try {
                    messages = Object.keys(messagesData)
                        .filter(
                            (key) =>
                                messagesData[key].recipientEmail ===
                                    user.email ||
                                messagesData[key].senderEmail === user.email
                        )
                        .map((key) => ({
                            ...messagesData[key],
                            type: "message",
                            date: new Date(messagesData[key].timestamp),
                        }));
                } catch (error) {
                    setError(error); // Update error state
                }
            }

            const offers = await getOfferByUser(user._id);
            const offersFiltered = offers.map((offer) => ({
                ...offer,
                type: "offer",
                date: new Date(offer.createdAt),
            }));

            const combinedInteractions = [...messages, ...offersFiltered];
            combinedInteractions.sort((a, b) => b.date - a.date);

            console.log(combinedInteractions);

            const latestInteractionsMap = new Map();

            for (const interaction of combinedInteractions) {
                const id =
                    interaction.type === "message"
                        ? interaction.recipientEmail === user.email
                            ? interaction.senderEmail
                            : interaction.recipientEmail
                        : interaction.buyerId === user._id
                        ? (await getUserById(interaction.sellerId)).user.email
                        : (await getUserById(interaction.buyerId)).user.email;

                if (
                    !latestInteractionsMap.has(id) ||
                    interaction.date > latestInteractionsMap.get(id).date
                ) {
                    latestInteractionsMap.set(id, interaction);
                }
            }

            const uniqueInteractions = Array.from(
                latestInteractionsMap.values()
            );

            console.log(uniqueInteractions);

            // Fetch names and pictures for unique interactions
            await Promise.all(
                uniqueInteractions.map(async (interaction) => {
                    const id =
                        interaction.type === "message"
                            ? interaction.recipientEmail === user.email
                                ? interaction.senderEmail
                                : interaction.recipientEmail
                            : interaction.buyerId === user._id
                            ? interaction.sellerId
                            : interaction.buyerId;

                    if (!names[id] || !pictures[id]) {
                        if (id.toString().includes("@")) {
                            const fetchedUser = (await getUserByEmail(id)).user;
                            console.log(fetchedUser);
                            setNames((prev) => ({
                                ...prev,
                                [fetchedUser.email]: fetchedUser.name,
                            }));
                            setPictures((prev) => ({
                                ...prev,
                                [fetchedUser.email]: fetchedUser.details?.image,
                            }));
                        } else {
                            const fetchedUser = (await getUserById(id)).user;
                            console.log(fetchedUser);
                            setNames((prev) => ({
                                ...prev,
                                [fetchedUser._id]: fetchedUser.name,
                            }));
                            setPictures((prev) => ({
                                ...prev,
                                [fetchedUser._id]: fetchedUser.details?.image,
                            }));
                        }
                    }
                })
            );

            setInteractions(uniqueInteractions);
        };

        const unsubscribe = onValue(messagesRef, handleValueChange);
        setLoading(false);

        return () => unsubscribe();
    }, [user._id]); // Dependency on fetchData to run it on component mount

    const handleRecipientClick = async (email) => {
        const { user } = await getUserByEmail(email);
        router.push(`/inbox/${user._id}`);
    };

    const handleRecipientClickById = (id) => {
        router.push(`/inbox/${id}`);
    };

    if (loading) {
        return <Loader />;
    }   

    return (
        <div className="flex flex-row h-screen antialiased pt-20 text-blue-800">
            <div className="flex flex-row w-96 flex-shrink-0 bg-gray-100 p-4">
                <div className="flex flex-col items-center py-4 flex-shrink-0 w-20 bg-indigo-800 rounded-3xl">
                    <a
                        href="#"
                        className="flex items-center justify-center h-12 w-12 bg-indigo-100 text-indigo-800 rounded-full"
                    >
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                            ></path>
                        </svg>
                    </a>
                    <ul className="flex flex-col space-y-2 mt-12">
                        <li>
                            <a href="/" className="flex items-center">
                                <span className="flex items-center justify-center text-indigo-100 hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                        ></path>
                                    </svg>
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="/" className="flex items-center">
                                <span className="flex items-center justify-center text-indigo-100 hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        ></path>
                                    </svg>
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="/" className="flex items-center">
                                <span className="flex items-center justify-center text-indigo-100 hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2z"
                                        ></path>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 20h4m1-10H9m4 4h1m-2-2h1m-2-2h1m0 0h1m-1 2h1"
                                        ></path>
                                    </svg>
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="/" className="flex items-center">
                                <span className="flex items-center justify-center text-indigo-100 hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.117V10a4 4 0 00-4-4H5a4 4 0 00-4 4v4a4 4 0 004 4h6v4a2 2 0 002-2v-2h2a2 2 0 012 2v4a2 2 0 002-2v-4a2 2 0 012 2v2a2 2 0 002-2v-2a2 2 0 00-2-2h-1v-2a2 2 0 012 2h2a2 2 0 012-2v-2a2 2 0 00-2-2h-5v-2a2 2 0 00-2-2V8a2 2 0 00-2-2V5a2 2 0 00-2-2V4a2 2 0 00-2-2V1a2 2 0 00-2-2V0a2 2 0 00-2-2V-1a2 2 0 00-2-2H0"
                                        ></path>
                                    </svg>
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col ml-4">
                    <div className="ml-4 text-2xl font-bold leading-none heading">
                        All conversations
                    </div>
                    <div className="mt-8 flex flex-col space-y-1">
                        {interactions.map((interaction, index) => {
                            const id =
                                interaction.type === "message"
                                    ? interaction.recipientEmail === user.email
                                        ? interaction.senderEmail
                                        : interaction.recipientEmail
                                    : interaction.buyerId === user._id
                                    ? interaction.sellerId
                                    : interaction.buyerId;

                            return (
                                <button
                                    key={index}
                                    onClick={() =>
                                        interaction.type === "message"
                                            ? handleRecipientClick(id)
                                            : handleRecipientClickById(id)
                                    }
                                    className="flex items-center px-4 py-2 space-x-2 rounded-lg hover:bg-blue-200"
                                >
                                    {pictures[id] ? (
                                        <img
                                            src={
                                                pictures[id] ||
                                                "/default-profile.jpg"
                                            }
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-blue-300 font-bold flex-shrink-0">
                                            {names[id] ? names[id][0] : "U"}
                                        </div>
                                    )}
                                    <div className="text-left">
                                        <div className="text-md font-semibold">
                                            {names[id] || "Unknown User"}
                                        </div>
                                        <div className="text-gray-500 text-sm">
                                            {interaction.type === "message"
                                                ? interaction.text.length > 50
                                                    ? interaction.text.substring(
                                                          0,
                                                          50
                                                      ) + "..."
                                                    : interaction.text
                                                : "Offer Interaction"}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inbox;
