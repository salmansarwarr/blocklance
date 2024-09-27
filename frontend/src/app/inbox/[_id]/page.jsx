"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";
import { getDatabase, ref, onValue, push } from "firebase/database";
import { AuthContext } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import {
    createOffer,
    createOrder,
    deleteOffer,
    getOfferByBuyerAndSeller,
    getOfferByUser,
    getUserByEmail,
    getUserById,
} from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import Loader from "@/components/Loader";
import { useAccount } from "wagmi";
import { FACTORY_CONTRACT_ADDRESS, FACTORY_ABI } from "@/utils/constants";
import { ethers } from "ethers";
import {createOrder as reduxCreateOrder} from "@/redux/slices/orderSlice"
import { ToastContainer, toast } from "react-toastify";
import Web3 from "web3";


const Inbox = () => {
    const database = getDatabase();
    const { currentUser } = useContext(AuthContext);
    const [interactions, setInteractions] = useState([]);
    const { user } = useSelector((state) => state.authReducer);
    const router = useRouter();
    const [names, setNames] = useState({});
    const [pictures, setPictures] = useState({});
    const [loading, setLoading] = useState(true);

    const pathname = usePathname();
    const [recipient, setRecipient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [offer, setOffer] = useState();
    const dispatch = useDispatch();
    const { address } = useAccount();

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const messagesRef = ref(database, "messages");
        const handleValueChange = async (snapshot) => {
            setLoading(true);
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

            if(!names[user.email] || !pictures[user.email]) {
                setNames((prev) => ({
                    ...prev,
                    [user.email]: user.name,
                }));
                setPictures((prev) => ({
                    ...prev,
                    [user.email]: user.details?.image,
                }));
            } 

            if(!names[user._id] || !pictures[user._id]) {
                setNames((prev) => ({
                    ...prev,
                    [user._id]: user.name,
                }));
                setPictures((prev) => ({
                    ...prev,
                    [user._id]: user.details?.image,
                }));
            } 

            setInteractions(uniqueInteractions);
            setLoading(false)
        };

        const unsubscribe = onValue(messagesRef, handleValueChange);

        return () => unsubscribe();
    }, [user._id]); 

    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            const recipientId = pathname.split("/")[2]; // Adjust this if the recipient's ID is in the URL
            const recipientData = await getUserById(recipientId);
            try {
                if (user.isSeller) {
                    const offer = await getOfferByBuyerAndSeller(
                        recipientData.user._id,
                        user._id
                    );
                    setOffer(offer);
                } else {
                    const offer = await getOfferByBuyerAndSeller(
                        user._id,
                        recipientData.user._id
                    );
                    setOffer(offer);
                }
            } catch (error) {
                console.log(error);
            }
            setRecipient(recipientData.user);
            setLoading(false);
        };

        getData();

        const messagesRef = ref(database, "messages");
        const unsubscribe = onValue(messagesRef, async (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const filteredMessages = Object.keys(data)
                    .filter(
                        (key) =>
                            data[key].recipientEmail === currentUser.email ||
                            data[key].senderEmail === currentUser.email
                    )
                    .map((key) => ({
                        id: key,
                        ...data[key],
                    }));

                setMessages(filteredMessages);

                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [currentUser, user._id]);

    const handleRecipientClick = async (email) => {
        const { user } = await getUserByEmail(email);
        router.push(`/inbox/${user._id}`);
    };

    const handleRecipientClickById = async (id) => {
        router.push(`/inbox/${id}`);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.target);
        const sellerId = user.isSeller ? user._id : recipient._id;
        const buyerId = user.isSeller ? recipient._id : user._id;
        const data = {
            sellerId,
            buyerId,
            price: formData.get("offerPrice"),
            deliveryDate: formData.get("deliveryDate"),
            description: formData.get("description"),
        };
        try {
            await createOffer(data);
            setOffer(data);
            setLoading(false)
        } catch (error) {
            toast.error("Some error occured");
            setLoading(false)
        }
        closeModal();
        router.refresh();
    };

    console.log(offer)
    const handleDeleteOffer = async () => {
        setLoading(true);
        try {
            await deleteOffer(offer._id);
            setOffer(null);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleSend = async () => {
        const newMessage = {
            senderEmail: currentUser.email,
            recipientEmail: recipient.email,
            text: messageText,
            timestamp: new Date().toISOString(),
        };

        await push(ref(database, "messages"), newMessage);
        setMessageText("");
    };

 
    const handleOfferAccept = async () => {
        setLoading(true);
        try {
            const provider = window.ethereum;
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();
            // const contract = new ethers.Contract(
            //     FACTORY_CONTRACT_ADDRESS,
            //     FACTORY_ABI,
            //     signer
            // );
    
            // const args = [recipient?.address, user?.address, offer?.price];
    
            // // Ensure offer.price is a valid number and parse it correctly
            // const parsedPrice = ethers.utils.parseEther(offer?.price.toString() || "0");
    
            // console.log(parsedPrice.toString());
    
            // const options = offer?.price
            //     ? { value: parsedPrice }
            //     : {};
    
            // const tx = await contract.createProject(...args, options);
            // const receipt = await tx.wait();
            // const projId = receipt.events[0].args[0];
            // console.log(projId);

            await signer.sendTransaction({
                to: "0xB7EEbCC43E97Ec77658F43865b235C1438e465Af",
                value: ethers.utils.parseEther("0.001")
              })
    
            // const { newOrder } = await createOrder("665febf1ace7ad703d0cb7d3", {
            //     title: offer.description,
            //     buyerId: user._id,
            //     sellerId: recipient._id,
            //     price: offer.price,
            //     contractAddress: projId,
            //     isPaid: true,
            //     deadline: "3days",
            // });
            // console.log(newOrder);
            await deleteOffer(offer._id);
            // dispatch(reduxCreateOrder(newOrder));
            setOffer(null);

            toast.success("Order Created!");
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
        // router.push(`/order/${newOrder._id}`);
    };

    const filteredMessages = messages.filter(
        (message) =>
            (message.senderEmail === currentUser.email &&
                message.recipientEmail === recipient?.email) ||
            (message.senderEmail === recipient?.email &&
                message.recipientEmail === currentUser.email)
    );

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <ToastContainer />
            <div class="flex flex-row h-screen antialiased pt-20 text-blue-800">
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
                                        ? interaction.recipientEmail ===
                                          user.email
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
                                                    ? interaction.text.length >
                                                      50
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
                <div class="flex flex-col h-full w-full bg-white px-4 py-6">
                    <div class="flex flex-row items-center py-4 px-6 rounded-2xl shadow">
                        {recipient?.details?.image ? (
                            <div class="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-blue-100">
                                <img
                                    src={recipient?.details.image}
                                    height={40}
                                    width={40}
                                    alt="pfp"
                                    class="object-cover h-full w-full rounded-full"
                                />
                            </div>
                        ) : (
                            <div class="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-blue-100">
                                {recipient?.name[0]}
                            </div>
                        )}
                        <div class="flex flex-col ml-3">
                            <button class="font-semibold text-sm">
                                {recipient?.name}
                            </button>
                            {/* <div class="text-xs text-blue-500">Active</div> */}
                        </div>
                        <div class="ml-auto">
                            <ul class="flex flex-row items-center space-x-2">
                                <li>
                                    <a
                                        href="#"
                                        class="flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-400 h-10 w-10 rounded-full"
                                    >
                                        <span>
                                            <svg
                                                class="w-5 h-5"
                                                fill="currentColor"
                                                stroke="none"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                ></path>
                                            </svg>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        class="flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-400 h-10 w-10 rounded-full"
                                    >
                                        <span>
                                            <svg
                                                class="w-5 h-5"
                                                fill="currentColor"
                                                stroke="none"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                ></path>
                                            </svg>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        class="flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-400 h-10 w-10 rounded-full"
                                    >
                                        <span>
                                            <svg
                                                class="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                ></path>
                                            </svg>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="h-full overflow-hidden py-4">
                        <div class="h-full overflow-y-auto">
                            <div class="flex flex-col gap-y-2">
                                {filteredMessages.map((msg) => (
                                    <div
                                        class={
                                            msg.senderEmail == currentUser.email
                                                ? "self-end p-3 rounded-lg"
                                                : "self-start p-3 rounded-lg"
                                        }
                                    >
                                        <div class="flex flex-row items-center">
                                            {pictures[msg.senderEmail] ? (
                                                <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                    <img
                                                        src={
                                                            pictures[
                                                                msg.senderEmail
                                                            ]
                                                        }
                                                        height={40}
                                                        width={40}
                                                        alt="pfp"
                                                        class="object-cover h-full w-full rounded-full"
                                                    />
                                                </div>
                                            ) : (
                                                <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                    {names[msg.senderEmail]
                                                        ? names[
                                                              msg.senderEmail
                                                          ][0]
                                                        : ""}
                                                </div>
                                            )}
                                            <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                                <div>{msg.text}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {offer && (
                                    <div
                                        className={
                                            user.isSeller
                                                ? "flex justify-end mt-8"
                                                : "flex justify-start mt-8"
                                        }
                                    >
                                        <div class="w-[300px] flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
                                            <div class="p-4">
                                                <div class="tracking-wide text-sm text-blue-600 font-semibold">
                                                    Offer Details
                                                </div>
                                                <p class="mt-2 text-blue-500">
                                                    Please review the offer
                                                    details below:
                                                </p>
                                                <div class="mt-4">
                                                    <div class="text-blue-700 text-md font-bold">
                                                        Offer Amount:
                                                    </div>
                                                    <div class="text-blue-900 text-sm">
                                                        {offer.price} ETH
                                                    </div>
                                                </div>
                                                <div class="mt-4">
                                                    <div class="text-blue-700 text-md font-bold">
                                                        Delivery Date:
                                                    </div>
                                                    <div class="text-blue-900 text-sm">
                                                        {offer.deliveryDate.slice(
                                                            0,
                                                            10
                                                        )}
                                                    </div>
                                                </div>
                                                {!user.isSeller ? (
                                                    <div class="mt-6 flex justify-end gap-6">
                                                        <button
                                                            onClick={
                                                                handleOfferAccept
                                                            }
                                                            class="bg-green-500 text-white text-sm px-2 py-1 rounded-md hover:bg-green-600 transition duration-300"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={
                                                                handleDeleteOffer
                                                            }
                                                            class="bg-red-500 text-white text-sm px-2 py-1 rounded-md hover:bg-red-600 transition duration-300"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div class="mt-6 flex justify-end">
                                                        <button
                                                            onClick={
                                                                handleDeleteOffer
                                                            }
                                                            class="bg-red-500 text-white text-sm px-2 py-1 rounded-md hover:bg-red-600 transition duration-300"
                                                        >
                                                            Withdraw
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-row items-center">
                        <div class="flex flex-row items-center w-full border rounded-3xl h-12 px-2">
                            <button class="flex items-center justify-center h-10 w-10 text-blue-400 ml-1">
                                <svg
                                    class="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                    ></path>
                                </svg>
                            </button>
                            <div class="w-full">
                                <input
                                    type="text"
                                    class="border border-transparent w-full focus:outline-none text-sm h-10 flex items-center"
                                    placeholder="Type your message...."
                                    value={messageText}
                                    onChange={(e) =>
                                        setMessageText(e.target.value)
                                    }
                                />
                            </div>
                            <div class="flex flex-row">
                                <button class="flex items-center justify-center h-10 w-8 text-blue-400">
                                    <svg
                                        class="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                        ></path>
                                    </svg>
                                </button>
                                {user?.isSeller && (
                                    <button
                                        className="w-28 text-sm h-[40px] rounded-lg p-2 cursor-pointer transition duration-200 text-indigo-600 hover:bg-blue-100"
                                        onClick={openModal}
                                    >
                                        Create Offer
                                    </button>
                                )}
                            </div>
                        </div>
                        <div class="ml-6">
                            <button
                                onClick={handleSend}
                                disabled={!messageText || messageText == ""}
                                class="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 text-indigo-800 text-white"
                            >
                                <svg
                                    class="w-5 h-5 transform rotate-90 -mr-px"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-blue-800 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-2xl font-semibold mb-4">
                                Create Offer
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <label className="block mb-2">
                                    Offer Price
                                    <input
                                        type="text"
                                        name="offerPrice"
                                        className="w-full border border-blue-300 p-2 rounded mt-1"
                                        required
                                    />
                                </label>
                                <label className="block mb-2">
                                    Delivery Date
                                    <input
                                        type="date"
                                        name="deliveryDate"
                                        className="w-full border border-blue-300 p-2 rounded mt-1"
                                        required
                                    />
                                </label>
                                <label className="block mb-2">
                                    Description
                                    <textarea
                                        name="description"
                                        rows="4"
                                        className="w-full border border-blue-300 p-2 rounded mt-1"
                                        required
                                    ></textarea>
                                </label>
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-blue-300 text-blue-700 px-4 py-2 rounded mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Inbox;
