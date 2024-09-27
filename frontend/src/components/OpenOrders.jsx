"use client";

import { getGigById, getUserById, createDispute } from "@/utils/api";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader"; // Import Loader component
import { useRouter } from "next/navigation";
import { PAYMENT_ABI } from "@/utils/constants";
import { ethers } from "ethers";

export default function OpenOrders() {
    const { orders } = useSelector((state) => state.orderReducer);
    const [orderDetails, setOrderDetails] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const details = await Promise.all(
                    orders.map(async (order) => {
                        const client = await getUserById(order.buyerId);
                        const gig = await getGigById(order.gigId);
                        if (!order.isCompleted) {
                            return {
                                ...order,
                                client: client.user,
                                gig: gig,
                            };
                        }
                    })
                );
                setOrderDetails(details.filter(order => order !== undefined));
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [orders]);

    const openModal = (order) => {
        setCurrentOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentOrder(null);
    };

    const handleDisputeSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const disputeData = {
            category: formData.get("category"),
            buyerTestimony: formData.get("description"),
            buyerEvidence: formData.get("evidence"),
            resolution: formData.get("resolution"),
            orderId: currentOrder._id,
            raisedBy:"buyer"
        };
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];

            const message = "I hereby acknowledge that I have initiated a dispute in good faith. The evidence presented is accurate, and I hold no personal animosity towards the seller. By signing this message, I affirm my commitment to the resolution process.";
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [message, account],
            });

            // const provider = new ethers.providers.Web3Provider(window.ethereum);
            // const signer = provider.getSigner();
            // const paymentContract = new ethers.Contract("0x8DE20D2Bba9b6707d287602eAeE1bf9a0f8b9f25", PAYMENT_ABI, signer);
            // await paymentContract.createDispute();

            disputeData.signedMessage = signature;

            const response = await createDispute(disputeData);
            
            console.log("Dispute created successfully:", response);
            router.push('/all-disputes')
        } else {
            console.error("MetaMask is not installed");
        }

        closeModal();
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
            {orderDetails.map((order) => (
                <div
                    key={order._id}
                    className="main-box border shadow-md my-4 border-gray-200 rounded-xl pt-6 pb-4 max-w-xl mx-auto lg:max-w-full"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200">
                        <div className="data">
                            <p className="font-semibold text-base leading-7 text-black">
                                Order Id:{" "}
                                <span className="text-indigo-600 font-medium">
                                    {order._id}
                                </span>
                            </p>
                            <p className="font-semibold text-base leading-7 text-black mt-4">
                                Order Payment:{" "}
                                <span className="text-gray-400 font-medium">
                                    {order.createdAt.slice(0, 10)}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="w-full px-3 min-[400px]:px-6">
                        <div className="flex flex-col lg:flex-row items-center py-6 border-b border-gray-200 gap-6 w-full">
                            {order.gig?.thumbnail && (
                                <div className="img-box max-lg:w-full">
                                    <img
                                        src={order.gig.thumbnail}
                                        alt="Gig Thumbnail"
                                        className="aspect-square w-full lg:max-w-[140px]"
                                    />
                                </div>
                            )}
                            <div className="flex flex-row w-full">
                                <div className="flex items-center max- mr-6">
                                    <div className="flex gap-3 lg:block">
                                        <p className="font-medium text-sm leading-7 text-black">
                                            Price
                                        </p>
                                        <p className=" font-medium text-sm leading-7 text-indigo-600">
                                            {order.price == 3 ? 1 : order.price } ETH
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center max- mr-6">
                                    <div className="flex gap-3 lg:block">
                                        <p className="font-medium text-sm leading-7 pl-1 text-black">
                                            Status
                                        </p>
                                        <p className="font-medium text-sm leading-6 whitespace-nowrap py-0.5 px-3 rounded-full bg-emerald-50 text-emerald-600">
                                            OPEN
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center max-">
                                    <div className="flex gap-3 lg:block">
                                        <p className="font-medium text-sm whitespace-nowrap leading-6 text-black">
                                            Expected Delivery Time
                                        </p>
                                        <p className="font-medium text-base whitespace-nowrap leading-7 pb-[-10px] text-emerald-500">
                                            {order.deadline}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <a
                            target="_blank"
                            href={`https://sepolia.etherscan.io/address/${order.contractAddress}`}
                        >
                            <button className="bg-green-600 text-white px-4 mr-4 py-2 rounded">
                                Track Payment
                            </button>
                        </a>
                        <button
                            className="bg-red-600 text-white px-4 py-2 mr-3 rounded"
                            onClick={() => openModal(order)}
                        >
                            Raise Dispute
                        </button>
                    </div>
                </div>
            ))}
            {isModalOpen && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
               <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
                   {/* Modal content */}
                   <form onSubmit={handleDisputeSubmit} className="space-y-6">
                       <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit Dispute Details</h2>
                       <div className="flex flex-col">
                           <label htmlFor="category" className="text-sm font-medium text-gray-700 mb-1">
                               Category
                           </label>
                           <input
                               type="text"
                               id="category"
                               name="category"
                               placeholder="Category"
                               required
                               className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           />
                       </div>
                       <div className="flex flex-col">
                           <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1">
                               Description
                           </label>
                           <textarea
                               id="description"
                               name="description"
                               placeholder="Description"
                               required
                               className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           ></textarea>
                       </div>
                       <div className="flex flex-col">
                           <label htmlFor="evidence" className="text-sm font-medium text-gray-700 mb-1">
                               Evidence
                           </label>
                           <input
                               type="text"
                               id="evidence"
                               name="evidence"
                               required
                               className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           />
                       </div>
                       <div className="flex flex-col">
                           <label htmlFor="resolution" className="text-sm font-medium text-gray-700 mb-1">
                               Resolution
                           </label>
                           <input
                               type="text"
                               id="resolution"
                               name="resolution"
                               placeholder="Resolution"
                               required
                               className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           />
                       </div>
                       <div className="flex justify-end">
                           <button
                               type="submit"
                               className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                           >
                               Submit Dispute
                           </button>
                           <button
                               type="button"
                               onClick={closeModal}
                               className="ml-4 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                           >
                               Cancel
                           </button>
                       </div>
                   </form>
               </div>
           </div>
           
            
            )}
        </div>
    );
}