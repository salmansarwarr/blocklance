import React, { useState, useEffect } from "react";
import { FaMoneyBill, FaClipboardList, FaMoneyCheckAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader"; // Import Loader component
import { ethers } from "ethers";

export default function Earnings() {
    const { user } = useSelector((state) => state.authReducer);
    const [withdrawn, setWithdrawn] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        // Simulate fetching user data (replace with actual fetching logic)
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    const withdraw = async () => {
        const provider = window.ethereum;
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();

        await signer.sendTransaction({
            to: "0xB7EEbCC43E97Ec77658F43865b235C1438e465Af",
            value: ethers.utils.parseEther("0.001"),
        });

        setWithdrawn(true);
    };

    if (isLoading) {
        return <Loader />; // Render Loader while fetching user data
    }

    return (
        <>
            <section className="text-black body-font">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-wrap -m-4 text-center">
                        <div className="p-4 sm:w-1/3 w-1/3">
                            <FaMoneyBill className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                            <h2 className="title-font font-medium sm:text-4xl text-3xl text-gray-900">
                                {0.001} $
                            </h2>
                            <p className="leading-relaxed">Total Earnings</p>
                        </div>
                        <div className="p-4 sm:w-1/3 w-1/3">
                            <FaClipboardList className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                            <h2 className="title-font font-medium sm:text-4xl text-3xl text-gray-900">
                                {0.001}
                            </h2>
                            <p className="leading-relaxed">Orders Completed</p>
                        </div>
                        <div className="p-4 sm:w-1/3 w-1/3">
                            <FaMoneyCheckAlt className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                            <h2 className="title-font font-medium sm:text-4xl text-3xl text-gray-900">
                                {withdrawn ? 0.001 : 0}
                            </h2>
                            <p className="leading-relaxed">Amount Withdrawn</p>
                        </div>
                    </div>
                    <button
                        onClick={withdraw}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Withdraw Amount
                    </button>
                </div>
            </section>
        </>
    );
}
