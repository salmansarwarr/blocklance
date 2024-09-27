"use client";
import { updateDisputeById } from "@/redux/slices/disputesSlice";
import { updateDispute, getDisputeById } from "@/utils/api";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { PAYMENT_ABI } from "@/utils/constants";
import Loader from "@/components/Loader";

export default function DisputePage() {
    const { user } = useSelector((state) => state.authReducer);

    const pathname = usePathname();
    const dispatch = useDispatch();
    const [dispute, setDispute] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const id = pathname.split("/")[2];
        const fetchDispute = async () => {
            try {
                const mockDispute = {
                    id: "1",
                    category: "Service",
                    description: "The service provided was not satisfactory.",
                    orderId: "12345",
                    resolution: "Refund",
                    creationDate: "2024-01-01",
                    buyerId: "user1",
                    sellerId: "user2",
                    buyerEvidence: "https://via.placeholder.com/150",
                    sellerEvidence: "https://via.placeholder.com/150",
                    raisedBy: "Buyer",
                    buyerTestimony: "The service was terrible and did not meet the standards.",
                    sellerTestimony: "The service was delivered as described and on time.",
                    comments: ["Initial comment"],
                    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
                    votes: 0,
                    buyerVotes: 0,
                    sellerVotes: 0,
                    resolved: false
                };
                setDispute(mockDispute);
                setComments(mockDispute.comments);

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const paymentContract = new ethers.Contract(mockDispute.contractAddress, PAYMENT_ABI, signer);
                setContract(paymentContract);
            } catch (error) {
                console.error("Failed to fetch dispute:", error);
            }
        };

        fetchDispute();
    }, [pathname]);

    const handleVote = async (voteForBuyer) => {
        if (!contract) {
            console.error("Contract not initialized");
            return;
        }

        try {
            const tx = await contract.voteOnDispute(voteForBuyer);
            await tx.wait();
            const disputeStatus = await contract.dispute();
            const updatedDispute = { 
                ...dispute, 
                votes: voteForBuyer ? dispute.votes + 1 : dispute.votes - 1,
                buyerVotes: disputeStatus.buyerVotes,
                sellerVotes: disputeStatus.sellerVotes,
                resolved: disputeStatus.resolved
            };
            setDispute(updatedDispute);
            dispatch(updateDisputeById(updatedDispute));
        } catch (error) {
            console.error("Failed to vote:", error);
        }
    };

    const handleCommentSubmit = async () => {
        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        const updatedDispute = { ...dispute, comments: updatedComments };
        await updateDispute(updatedDispute.id, updatedDispute);
        dispatch(updateDisputeById(updatedDispute));
        setNewComment("");
    };

    const handleUpdateDispute = async (updatedData) => {
        const updatedDispute = { ...dispute, ...updatedData };
        await updateDispute(dispute.id, updatedDispute);
        setDispute(updatedDispute);
        dispatch(updateDisputeById(updatedDispute));
    };

    if (!dispute) {
        <div className="flex justify-center items-center h-full">
                <Loader />
                <p className="text-gray-700 ml-2">Loading dispute details...</p>
            </div>
    }

    const isUserBuyerOrSeller = user && (user.id === dispute.buyerId || user.id === dispute.sellerId);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Dispute Details</h1>
            <div className="border border-gray-300 rounded-lg p-4 mb-4">
                <h2 className="text-xl font-semibold mb-2">
                    Dispute ID: {dispute.id}
                </h2>
                <p className="text-gray-700 mb-1">
                    <strong>Category:</strong> {dispute.category}
                </p>
                <p className="text-gray-700 mb-1">
                    <strong>Description:</strong> {dispute.description}
                </p>
                <p className="text-gray-700 mb-1">
                    <strong>Order ID:</strong> {dispute.orderId}
                </p>
                <p className="text-gray-700 mb-1">
                    <strong>Preferred Resolution:</strong> {dispute.resolution}
                </p>
                <p className="text-gray-700 mb-1">
                    <strong>Creation Date:</strong> {dispute.creationDate}
                </p>
                <p className="text-gray-700 mb-1">
                    <strong>Dispute Raised By:</strong> {dispute.raisedBy}
                </p>
                <div className="mt-2">
                    <strong>Buyer Testimony:</strong>
                    <p className="text-gray-700 mb-2">{dispute.buyerTestimony}</p>
                    <strong>Buyer's Evidence:</strong>
                    {dispute.buyerEvidence ? (
                        <div className="mt-1">
                            <img
                                src={dispute.buyerEvidence}
                                alt="Buyer's Evidence"
                                className="max-w-xs border rounded"
                            />
                        </div>
                    ) : (
                        <p className="text-gray-700">No buyer's evidence provided.</p>
                    )}
                </div>
                <div className="mt-2">
                    <strong>Seller Testimony:</strong>
                    <p className="text-gray-700 mb-2">{dispute.sellerTestimony}</p>
                    <strong>Seller's Evidence:</strong>
                    {dispute.sellerEvidence ? (
                        <div className="mt-1">
                            <img
                                src={dispute.sellerEvidence}
                                alt="Seller's Evidence"
                                className="max-w-xs border rounded"
                            />
                        </div>
                    ) : (
                        <p className="text-gray-700">No seller's evidence provided.</p>
                    )}
                </div>
                <div className="mt-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => handleVote(true)}
                    >
                        Vote for Buyer ({dispute.buyerVotes || 0})
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleVote(false)}
                    >
                        Vote for Seller ({dispute.sellerVotes || 0})
                    </button>
                </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-4 mb-4">
                <h2 className="text-xl font-semibold mb-2">Comments</h2>
                <textarea
                    className="w-full border rounded p-2 mb-2"
                    rows="4"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleCommentSubmit}
                >
                    Submit Comment
                </button>
                {comments.map((comment, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-2 mt-2"
                    >
                        <p className="text-gray-700">{comment}</p>
                    </div>
                ))}
            </div>

            {isUserBuyerOrSeller && (
                <div className="border border-gray-300 rounded-lg p-4 mb-4">
                    <h2 className="text-xl font-semibold mb-2">Update Dispute</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const updatedData = {
                                buyerTestimony: e.target.buyerTestimony.value,
                                sellerTestimony: e.target.sellerTestimony.value,
                                buyerEvidence: e.target.buyerEvidence.value,
                                sellerEvidence: e.target.sellerEvidence.value,
                            };
                            handleUpdateDispute(updatedData);
                        }}
                    >
                        <div className="mb-2">
                            <label className="block text-gray-700 mb-1">Buyer Testimony:</label>
                            <textarea
                                name="buyerTestimony"
                                className="w-full border rounded p-2"
                                defaultValue={dispute.buyerTestimony}
                            ></textarea>
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700 mb-1">Seller Testimony:</label>
                            <textarea
                                name="sellerTestimony"
                                className="w-full border rounded p-2"
                                defaultValue={dispute.sellerTestimony}
                            ></textarea>
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700 mb-1">Buyer Evidence URL:</label>
                            <input
                                type="text"
                                name="buyerEvidence"
                                className="w-full border rounded p-2"
                                defaultValue={dispute.buyerEvidence}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700 mb-1">Seller Evidence URL:</label>
                            <input
                                type="text"
                                name="sellerEvidence"
                                className="w-full border rounded p-2"
                                defaultValue={dispute.sellerEvidence}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Update Dispute
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
