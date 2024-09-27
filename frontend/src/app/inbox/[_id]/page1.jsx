            // const provider = window.ethereum;
            // const ethersProvider = new ethers.providers.Web3Provider(provider);
            // const signer = ethersProvider.getSigner();
            // const contract = new ethers.Contract(
            //     FACTORY_CONTRACT_ADDRESS,
            //     FACTORY_ABI,
            //     signer
            // );
            // const args = user?.isSeller
            //     ? [recipient?.address, user?.address, offer?.price]
            //     : [recipient?.address, user?.address, offer?.price];

            // const options = offer?.price
            //     ? { value: ethers.utils.parseEther(offer.price.toString()) }
            //     : {};

            // const tx = await contract.createProject(...args, options);
            // const reciept = await tx.wait();
            // const projId = reciept.events[0].args[0];
            // console.log(projId);

"use client";

import React, { useState, useEffect, useContext } from "react";
import { getDatabase, ref, onValue, push } from "firebase/database";
import { AuthContext } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import {
    createOffer,
    createOrder,
    deleteOffer,
    getOfferByBuyerAndSeller,
    getUserByEmail,
    getUserById,
} from "@/utils/api";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { FaPerson } from "react-icons/fa6";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import Loader from "@/components/Loader";
import { FACTORY_CONTRACT_ADDRESS, FACTORY_ABI } from "@/utils/constants";
import { useAccount, useContractWrite } from "wagmi";
import { ethers } from "ethers";

const Inbox = () => {
    const database = getDatabase();
    const { currentUser } = useContext(AuthContext);
    const [recipient, setRecipient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [recipientMessages, setRecipientMessages] = useState();
    const [messageText, setMessageText] = useState("");
    const router = useRouter();
    const pathname = usePathname();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [offer, setOffer] = useState();
    const { user } = useSelector((state) => state.authReducer);
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(true);

    const handleDeleteOffer = async () => {
        setIsLoading(true);
        try {
            await deleteOffer(offer._id);
            setOffer(null);
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };

    const { write } = useContractWrite({
        abi: FACTORY_ABI,
        address: FACTORY_CONTRACT_ADDRESS,
        functionName: "createProject",
        args: user?.isSeller
            ? [recipient?.address, user?.address, offer?.price]
            : [recipient?.address, user?.address, offer?.price],
        value: ethers.utils.parseEther(offer?.price?.toString() || "1"),
    });

    const handleOfferAccept = async () => {
        // if(address != user.walletAddress) {
        //     alert("Registered wallet not connected");
        //     return
        // }
        write();
        // const orderId = await createOrder("665fd857edee1b8e1a024da8", {
        //     buyerId: user._id,
        //     sellerId: recipient._id,
        //     price: offer.price,
        // });
        // router.push(`/order/${orderId}`);
    };

    const getNameByEmail = async (email) => {
        const { user } = await getUserByEmail(email);
        return user.name;
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.target);
        const data = {
            sellerId: user._id,
            buyerId: recipient._id,
            price: formData.get("offerPrice"),
            deliveryDate: formData.get("deliveryDate"),
            description: formData.get("description"),
        };
        try {
            await createOffer(data);
            setOffer(data);
        } catch (error) {
            toast.error("Some error occured");
        }
        closeModal();
        setIsLoading(false);
    };

    useEffect(() => {
        const getData = async () => {
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
        };

        getData();

        const messagesRef = ref(database, "messages");
        const unsubscribe = onValue(messagesRef, (snapshot) => {
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

                const groupedMessages = filteredMessages.reduce(
                    (acc, message) => {
                        const otherEmail =
                            message.senderEmail === currentUser.email
                                ? message.recipientEmail
                                : message.senderEmail;

                        if (!acc[otherEmail]) {
                            acc[otherEmail] = [];
                        }
                        acc[otherEmail].push(message);

                        return acc;
                    },
                    {}
                );

                const mostRecentMessages = Object.keys(groupedMessages).map(
                    (email) => {
                        const messages = groupedMessages[email];
                        console.log(messages);
                        const recipientName = getNameByEmail(
                            messages[messages.length - 1].recipientEmail
                        );
                        const senderName = getNameByEmail(
                            messages[messages.length - 1].recipientEmail
                        );
                        return {
                            ...messages[messages.length - 1],
                            recipientName,
                            senderName,
                        };
                    }
                );

                setRecipientMessages(mostRecentMessages);
            }
        });

        setIsLoading(false);

        return () => unsubscribe();
    }, [currentUser, pathname]);

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

    const handleRecipientClick = async (email) => {
        setIsLoading(true);
        const { user } = await getUserByEmail(email);
        router.push(`/inbox/${user._id}`);
        setRecipient({ email });
    };

    const filteredMessages = messages.filter(
        (message) =>
            (message.senderEmail === currentUser.email &&
                message.recipientEmail === recipient?.email) ||
            (message.senderEmail === recipient?.email &&
                message.recipientEmail === currentUser.email)
    );

    if (isLoading) {
        return <Loader />;
    }

    return (
//         <main className="flex flex-col lg:flex-row w-full h-full shadow-lg rounded-3xl pt-20">
//             <ToastContainer />
//             <section className="flex flex-row mb-4 sm:flex-col lg:flex-col lg:w-1/12 bg-white rounded-l-3xl">
//                 <div className="w-16 mx-auto mt-12 p-4 bg-indigo-600 rounded-2xl text-white items-center">
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="1"
//                             d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
//                         />
//                     </svg>
//                 </div>
//             </section>
//             <section className="flex flex-col pt-3 lg:w-4/12 bg-gray-50 h-full overflow-y-scroll">
//                 <label className="px-3">
//                     <input
//                         className="rounded-lg p-4 bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 w-full"
//                         placeholder="Search..."
//                     />
//                 </label>

//                 <ul className="mt-6">
//                     {recipientMessages &&
//                         recipientMessages.map((message) => (
//                             <li
//                                 key={message.id}
//                                 className="py-5 border-b px-3 transition hover:bg-indigo-100"
//                                 onClick={() =>
//                                     handleRecipientClick(
//                                         message.senderEmail ===
//                                             currentUser.email
//                                             ? message.recipientEmail
//                                             : message.senderEmail
//                                     )
//                                 }
//                             >
//                                 <div className="cursor-pointer flex justify-between items-center">
//                                     <h3 className="text-lg font-semibold">
//                                         {message.senderEmail ===
//                                         currentUser.email
//                                             ? message.recipientName
//                                             : message.senderName}
//                                     </h3>
//                                     <p className="text-md text-gray-400">
//                                         {new Date(
//                                             message.timestamp
//                                         ).toLocaleTimeString()}
//                                     </p>
//                                 </div>
//                                 <div className="text-md italic text-gray-400">
//                                     {message.text}
//                                 </div>
//                             </li>
//                         ))}
//                 </ul>
//             </section>
//             <section className="w-full lg:w-7/12 px-4 flex flex-col bg-white rounded-r-3xl">
//                 <div className="flex justify-between items-center h-24 border-b-2 mb-8">
//                     <div className="flex space-x-4 items-center">
//                         <div className="h-12 w-12 rounded-full overflow-hidden">
//                             <img
//                                 src={
//                                     recipient?.image ||
//                                     "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
//                                 }
//                                 loading="lazy"
//                                 className="h-full w-full object-cover"
//                             />
//                         </div>
//                         <div className="flex flex-col">
//                             <h3 className="font-semibold text-lg">
//                                 {recipient?.name}
//                             </h3>
//                         </div>
//                     </div>
//                 </div>
//                 <section>
//                     <article className="mt-8 text-gray-500 leading-7 tracking-wider">
//                     {filteredMessages.map((message) => (
//     <div
//         key={message.id}
//         className={`message ${
//             message.senderEmail === currentUser.email
//                 ? "sent"
//                 : "received"
//         }`}
//     >
//         <p>{message.text}</p>
//         <span>
//             {new Date(
//                 message.timestamp
//             ).toLocaleString()}
//         </span>
//     </div>
// ))}

//                     </article>
                    // {offer && (
                    //     <div className="flex justify-end mt-8">
                    //         <div class="w-[300px] flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
                    //             <div class="p-4">
                    //                 <div class="tracking-wide text-sm text-blue-600 font-semibold">
                    //                     Offer Details
                    //                 </div>
                    //                 <p class="mt-2 text-gray-500">
                    //                     Please review the offer details below:
                    //                 </p>
                    //                 <div class="mt-4">
                    //                     <div class="text-gray-700 text-md font-bold">
                    //                         Offer Amount:
                    //                     </div>
                    //                     <div class="text-gray-900 text-sm">
                    //                         {offer.price} ETH
                    //                     </div>
                    //                 </div>
                    //                 <div class="mt-4">
                    //                     <div class="text-gray-700 text-md font-bold">
                    //                         Delivery Date:
                    //                     </div>
                    //                     <div class="text-gray-900 text-sm">
                    //                         {offer.deliveryDate}
                    //                     </div>
                    //                 </div>
                    //                 {!user.isSeller ? (
                    //                     <div class="mt-6 flex justify-end gap-6">
                    //                         <button
                    //                             onClick={handleOfferAccept}
                    //                             class="bg-green-500 text-white text-sm px-2 py-1 rounded-md hover:bg-green-600 transition duration-300"
                    //                         >
                    //                             Accept
                    //                         </button>
                    //                         <button
                    //                             onClick={handleDeleteOffer}
                    //                             class="bg-red-500 text-white text-sm px-2 py-1 rounded-md hover:bg-red-600 transition duration-300"
                    //                         >
                    //                             Reject
                    //                         </button>
                    //                     </div>
                    //                 ) : (
                    //                     <div class="mt-6 flex justify-end">
                    //                         <button
                    //                             onClick={handleDeleteOffer}
                    //                             class="bg-red-500 text-white text-sm px-2 py-1 rounded-md hover:bg-red-600 transition duration-300"
                    //                         >
                    //                             Withdraw
                    //                         </button>
                    //                     </div>
                    //                 )}
                    //             </div>
                    //         </div>
                    //     </div>
                    // )}
//                 </section>
//                 <section className="mt-6 border rounded-xl bg-gray-50 mb-3">
//                     <textarea
//                         className="w-full bg-gray-50 p-2 rounded-xl"
//                         placeholder="Type your reply here..."
//                         rows="3"
                        // value={messageText}
                        // onChange={(e) => setMessageText(e.target.value)}
//                     ></textarea>
//                     <div className="flex items-center justify-between p-2">
//                     {user?.isSeller && (
//     <button
//         className="w-30 h-[40px] border rounded-lg p-2 cursor-pointer transition duration-200 text-indigo-600 hover:bg-blue-100"
//         onClick={openModal}
//     >
//         Create Offer
//     </button>
// )}

                        // {isModalOpen && (
                        //     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                        //         <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        //             <h2 className="text-2xl font-semibold mb-4">
                        //                 Create Offer
                        //             </h2>
                        //             <form onSubmit={handleSubmit}>
                        //                 <label className="block mb-2">
                        //                     Offer Price
                        //                     <input
                        //                         type="number"
                        //                         name="offerPrice"
                        //                         className="w-full border border-gray-300 p-2 rounded mt-1"
                        //                         required
                        //                     />
                        //                 </label>
                        //                 <label className="block mb-2">
                        //                     Delivery Date
                        //                     <input
                        //                         type="date"
                        //                         name="deliveryDate"
                        //                         className="w-full border border-gray-300 p-2 rounded mt-1"
                        //                         required
                        //                     />
                        //                 </label>
                        //                 <label className="block mb-2">
                        //                     Description
                        //                     <textarea
                        //                         name="description"
                        //                         rows="4"
                        //                         className="w-full border border-gray-300 p-2 rounded mt-1"
                        //                         required
                        //                     ></textarea>
                        //                 </label>
                        //                 <div className="flex justify-end mt-4">
                        //                     <button
                        //                         type="button"
                        //                         onClick={closeModal}
                        //                         className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                        //                     >
                        //                         Cancel
                        //                     </button>
                        //                     <button
                        //                         type="submit"
                        //                         className="bg-blue-600 text-white px-4 py-2 rounded"
                        //                     >
                        //                         Submit
                        //                     </button>
                        //                 </div>
                        //             </form>
                        //         </div>
                        //     </div>
                        // )}
//                         <button
//                             className="bg-purple-600 text-white px-6 py-2 rounded-xl"
//                             onClick={handleSend}
//                         >
//                             Reply
//                         </button>
//                     </div>
//                 </section>
//             </section>
//         </main>
//         //
        <div class="flex flex-row h-screen antialiased pt-20 text-gray-800">
        <div class="flex flex-row w-96 flex-shrink-0 bg-gray-100 p-4">
          <div class="flex flex-col items-center py-4 flex-shrink-0 w-20 bg-indigo-800 rounded-3xl">
            <a href="#"
               class="flex items-center justify-center h-12 w-12 bg-indigo-100 text-indigo-800 rounded-full">
              <svg class="w-8 h-8"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
            </a>
            <ul class="flex flex-col space-y-2 mt-12">
              <li>
                <a href="#"
                   class="flex items-center">
                  <span class="flex items-center justify-center text-indigo-100 hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                    <svg class="w-6 h-6"
                         fill="none"
                         stroke="currentColor"
                         viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                  </span>
                </a>
              </li>
              <li>
                <a href="#"
                   class="flex items-center">
                  <span class="flex items-center justify-center text-indigo-100 hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                    <svg class="w-6 h-6"
                         fill="none"
                         stroke="currentColor"
                         viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </span>
                </a>
              </li>
              <li>
                <a href="#"
                   class="flex items-center">
                  <span class="flex items-center justify-center text-indigo-100 hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                    <svg class="w-6 h-6"
                         fill="none"
                         stroke="currentColor"
                         viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </span>
                </a>
              </li>
              <li>
                <a href="#"
                   class="flex items-center">
                  <span class="flex items-center justify-center text-indigo-100 hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                    <svg class="w-6 h-6"
                         fill="none"
                         stroke="currentColor"
                         viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </span>
                </a>
              </li>
            </ul>
            <button class="mt-auto flex items-center justify-center hover:text-indigo-100 text-indigo-500 h-10 w-10">
              <svg class="w-6 h-6"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            </button>
          </div>
          <div class="flex flex-col w-full h-full pl-4 pr-4 py-4 -mr-4">
            <div class="flex flex-row items-center">
              <div class="flex flex-row items-center">
                <div class="text-xl font-semibold">Messages</div>
                {/* <div class="flex items-center justify-center ml-2 text-xs h-5 w-5 text-white bg-red-500 rounded-full font-medium">5</div> */}
              </div>
              <div class="ml-auto">
                <button class="flex items-center justify-center h-7 w-7 bg-gray-200 text-gray-500 rounded-full">
                  <svg class="w-4 h-4 stroke-current"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="mt-5">
              <ul class="flex flex-row items-center justify-between">
                <li>
                  <a href="#"
                     class="flex items-center pb-3 text-xs font-semibold relative text-indigo-800">
                    <span>All Conversations</span>
                    <span class="absolute left-0 bottom-0 h-1 w-6 bg-indigo-800 rounded-full"></span>
                  </a>
                </li>
                
              </ul>
            </div>
            
            <div class="mt-2">
              <div class="flex flex-col -mx-4">
                
                <div class="flex flex-row items-center p-4 bg-gradient-to-r from-red-100 to-transparent border-l-2 border-red-500">
                  <div class="flex items-center justify-center h-10 w-10 rounded-full bg-pink-500 text-pink-300 font-bold flex-shrink-0">
                    T
                  </div>
                  <div class="flex flex-col flex-grow ml-3">
                    <div class="flex items-center">
                      <div class="text-sm font-medium">UI Art Design</div>
                      <div class="h-2 w-2 rounded-full bg-green-500 ml-2"></div>
                    </div>
                    <div class="text-xs truncate w-40">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, doloribus?</div>
                  </div>
                </div>
              </div>
            </div>
           
          </div>
        </div>
        <div class="flex flex-col h-full w-full bg-white px-4 py-6">
          <div class="flex flex-row items-center py-4 px-6 rounded-2xl shadow">
            <div class="flex items-center justify-center h-10 w-10 rounded-full bg-pink-500 text-pink-100">
              T
            </div>
            <div class="flex flex-col ml-3">
              <div class="font-semibold text-sm">UI Art Design</div>
              <div class="text-xs text-gray-500">Active</div>
            </div>
            <div class="ml-auto">
              <ul class="flex flex-row items-center space-x-2">
                <li>
                  <a href="#"
                     class="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-400 h-10 w-10 rounded-full">
                    <span>
                      <svg class="w-5 h-5"
                           fill="currentColor"
                           stroke="none"
                           viewBox="0 0 24 24"
                           xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </span>
                  </a>
                </li>
                <li>
                  <a href="#"
                     class="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-400 h-10 w-10 rounded-full">
                    <span>
                      <svg class="w-5 h-5"
                           fill="currentColor"
                           stroke="none"
                           viewBox="0 0 24 24"
                           xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </span>
                  </a>
                </li>
                <li>
                  <a href="#"
                     class="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-400 h-10 w-10 rounded-full">
                    <span>
                      <svg class="w-5 h-5"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                           xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                      </svg>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="h-full overflow-hidden py-4">
            <div class="h-full overflow-y-auto">
              <div class="grid grid-cols-12 gap-y-2">
                <div class="col-start-1 col-end-8 p-3 rounded-lg">
                  <div class="flex flex-row items-center">
                    <div
                        class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                    >
                      A
                    </div>
                    <div
                        class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                    >
                      <div>Hey How are you today?</div>
                    </div>
                  </div>
                </div>
              
                <div class="col-start-6 col-end-13 p-3 rounded-lg">
                  <div class="flex items-center justify-start flex-row-reverse">
                    <div
                        class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                    >
                      A
                    </div>
                    <div
                        class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                    >
                      <div>I'm ok what about you?</div>
                    </div>
                  </div>
                </div>
               
              </div>
            </div>
          </div>
          <div class="flex flex-row items-center">
            <div class="flex flex-row items-center w-full border rounded-3xl h-12 px-2">
              <button class="flex items-center justify-center h-10 w-10 text-gray-400 ml-1">
                <svg class="w-5 h-5"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
              </button>
              <div class="w-full">
                <input type="text"
                       class="border border-transparent w-full focus:outline-none text-sm h-10 flex items-center" placeholder="Type your message...."/>
              </div>
              <div class="flex flex-row">
                <button class="flex items-center justify-center h-10 w-8 text-gray-400">
                  <svg class="w-5 h-5"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                  </svg>
                </button>
                <button class="flex items-center justify-center h-10 w-8 text-gray-400 ml-1 mr-2">
                  <svg class="w-5 h-5"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="ml-6">
              <button class="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 text-indigo-800 text-white">
                <svg class="w-5 h-5 transform rotate-90 -mr-px"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

        //
    );
};

export default Inbox;
