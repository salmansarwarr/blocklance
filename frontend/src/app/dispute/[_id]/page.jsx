"use client";
import { updateDisputeById } from "@/redux/slices/disputesSlice";
import { updateDispute, getDisputeById, counterProof } from "@/utils/api";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { PAYMENT_ABI } from "@/utils/constants";
import Loader from "@/components/Loader";
// import { Spinner } from "@/components/Spinner";

export default function DisputePage() {
    const { user } = useSelector((state) => state.authReducer);
    const [buyerVote, setBuyerVote] = useState(0);
    const [sellerVote, setSellerVote] = useState(0);

    const pathname = usePathname();
    const dispatch = useDispatch();
    const [dispute, setDispute] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const id = pathname.split("/")[2];
        console.log(user._id);
        const fetchDispute = async () => {
            try {
                const disputeData = await getDisputeById(id);
                setDispute(disputeData);
                setComments(disputeData.comments);
                console.log(
                    disputeData.orderDetails.sellerId,
                    disputeData.orderDetails.buyerId
                );
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                const signer = provider.getSigner();
                const paymentContract = new ethers.Contract(
                    disputeData.orderDetails.contractAddress,
                    PAYMENT_ABI,
                    signer
                );
                setContract(paymentContract);
            } catch (error) {
                console.error("Failed to fetch dispute:", error);
            }
        };

        fetchDispute();
    }, [pathname]);

    const handleCounterProofSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const counterData = {
            testimony: formData.get("testimony"),
            evidence: formData.get("evidence"),
        };

        try {
            const updatedDispute = await counterProof(dispute.id, counterData);
            setDispute(updatedDispute);
            dispatch(updateDisputeById(updatedDispute));
        } catch (error) {
            console.error("Failed to submit counter proof:", error);
        }
    };

    const handleVote = async (voteForBuyer) => {
        // if (!contract) {
        //     console.error("Contract not initialized");
        //     return;
        // }

        try {
            // const tx = await contract.voteOnDispute(voteForBuyer);
            // await tx.wait();
            // const disputeStatus = await contract.dispute();
            // const updatedDispute = {
            //     ...dispute,
            //     votes: voteForBuyer ? dispute.votes + 1 : dispute.votes - 1,
            //     buyerVotes: disputeStatus.buyerVotes,
            //     sellerVotes: disputeStatus.sellerVotes,
            //     resolved: disputeStatus.resolved
            // };

            // setDispute(updatedDispute);
            // dispatch(updateDisputeById(updatedDispute));
            if (typeof window.ethereum !== "undefined") {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const account = accounts[0];

                const message =
                    "I hereby adhere that I have no relation with buyer and seller and I am neutrally assesing this dispute";
                const signature = await window.ethereum.request({
                    method: "personal_sign",
                    params: [message, account],
                });
                voteForBuyer
                    ? setBuyerVote((prev) => prev + 1)
                    : setSellerVote((prev) => prev + 1);
            }
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
        return (
            <div className="flex justify-center items-center h-full">
                <Loader />
                <p className="text-gray-700 ml-2">Loading dispute details...</p>
            </div>
        );
    }
    const hasBuyerTestimonyAndEvidence =
        dispute.buyerTestimony && dispute.buyerEvidence;
    const hasSellerTestimonyAndEvidence =
        dispute.sellerTestimony && dispute.sellerEvidence;

    const showCounterProofForm = !(
        hasBuyerTestimonyAndEvidence && hasSellerTestimonyAndEvidence
    );
    const isUserBuyerOrSeller =
        user &&
        (user._id == dispute.orderDetails.sellerId ||
            user._id == dispute.orderDetails.buyerId);
    console.log(isUserBuyerOrSeller);

    return (
        <div className="container mx-auto p-6 ">
            <div className="h-[250px] bg-gradient-to-r from-blue-500 to-purple-600 flex justify-center items-center">
                <h1 className="text-center heading h1 px-10 text-xl mt-10 sm:text-3xl font-bold text-white">
                    Dispute Details <br />
                    <span className="h4 text-md sm:text-xl text-white font-thin">
                        Efficiently resolve conflicts, rebuild trust.
                    </span>
                </h1>
            </div>
            <div className="flex justify-between items-center">
                <div className="border border-gray-300 rounded-lg p-6 mb-6 shadow-lg max-w-6xl m-10 ">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">
                            Dispute ID: {dispute.id}
                        </h2>
                        <span
                            className={`badge ${
                                dispute.resolved
                                    ? "bg-green-500"
                                    : "bg-yellow-500"
                            } text-white px-4 py-2 rounded`}
                        >
                            {dispute.resolved ? "Resolved" : "Pending"}
                        </span>
                    </div>
                    <p className="text-gray-700 mb-2">
                        <strong>Category:</strong> {dispute.category}
                    </p>
                    <p className="text-gray-700 mb-2">
                        <strong>Description:</strong> {dispute.description}
                    </p>
                    <p className="text-gray-700 mb-2">
                        <strong>Order ID:</strong> {dispute.orderId}
                    </p>
                    <p className="text-gray-700 mb-2">
                        <strong>Preferred Resolution:</strong>{" "}
                        {dispute.resolution}
                    </p>
                    <p className="text-gray-700 mb-2">
                        <strong>Creation Date:</strong>{" "}
                        {new Date(dispute.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 mb-4">
                        <strong>Dispute Raised By:</strong> {dispute.raisedBy}
                    </p>

                    <div className="mb-4">
                        <strong>Buyer Testimony:</strong>
                        <p className="text-gray-700 mb-2">
                            {dispute.buyerTestimony}
                        </p>
                        <strong>Buyer's Evidence:</strong>
                        {dispute.buyerEvidence ? (
                            <div className="mt-2">
                                <img
                                    src={dispute.buyerEvidence}
                                    alt="Buyer's Evidence"
                                    className="max-w-xs border rounded"
                                />
                            </div>
                        ) : (
                            <p className="text-gray-700">
                                No buyer's evidence provided.
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <strong>Seller Testimony:</strong>
                        <p className="text-gray-700 mb-2">
                            {dispute.sellerTestimony}
                        </p>
                        <strong>Seller's Evidence:</strong>
                        {dispute.sellerEvidence ? (
                            <div className="mt-2">
                                <img
                                    src={dispute.sellerEvidence}
                                    alt="Seller's Evidence"
                                    className="max-w-xs border rounded"
                                />
                            </div>
                        ) : (
                            <p className="text-gray-700">
                                No seller's evidence provided.
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between mb-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleVote(true)}
                        >
                            Vote for Buyer ({buyerVote || 0})
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleVote(false)}
                        >
                            Vote for Seller ({sellerVote || 0})
                        </button>
                    </div>
                </div>

                <div className="border border-gray-300 rounded-lg p-6 mb-6 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                    <textarea
                        className="w-full border rounded p-2 mb-4"
                        rows="4"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                    ></textarea>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                        onClick={handleCommentSubmit}
                    >
                        Submit Comment
                    </button>
                    {comments.map((comment, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4 mt-2 shadow-sm"
                        >
                            <p className="text-gray-700 mb-1">
                                <strong>Anonymous user {index + 1}:</strong>
                            </p>
                            <p className="text-gray-700">{comment}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Optional Update Dispute Form */}
            {isUserBuyerOrSeller && showCounterProofForm && (
                <div className="border border-gray-300 rounded-lg p-6 mb-6 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">
                        Counter Proof Submission
                    </h2>
                    <form onSubmit={handleCounterProofSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">
                                Testimony:
                            </label>
                            <textarea
                                name="testimony"
                                className="w-full border rounded p-2"
                                rows="4"
                                placeholder="Enter your counter testimony..."
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">
                                Evidence URL:
                            </label>
                            <input
                                type="text"
                                name="evidence"
                                className="w-full border rounded p-2"
                                placeholder="Enter URL to your counter evidence..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Submit Counter Proof
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
