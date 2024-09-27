"use client";
import React, { useEffect, useState } from "react";
import "./style.css";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { getAllDisputes } from "@/utils/api";

import Loader from "@/components/Loader";

export default function DisputesPage() {
    const dispatch = useDispatch();
    const { allDisputes } = useSelector((state) => state.disputeReducer);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDisputes = async () => {
            try {
                const disputes = await getAllDisputes();
                dispatch({ type: 'SET_DISPUTES', payload: disputes });
            } catch (error) {
                console.error("Failed to fetch disputes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDisputes();
    }, [dispatch]);

    return (
        <>
            <div className="h-[250px] bg-gradient-to-r from-blue-500 to-purple-600 flex justify-center items-center">
                <h1 className="text-center heading h1 px-10 text-xl mt-10 sm:text-3xl font-bold text-white">
                    All Disputes <br />
                    <span className="h4 text-md sm:text-xl text-white font-thin">
                        Review and manage all disputes raised by freelancers and clients
                    </span>
                </h1>
            </div>
            <div className="container max-w-3xl mx-auto p-6">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader />
                        <p className="text-gray-700 ml-2">Loading disputes...</p>
                    </div>
                ) : allDisputes.length > 0 ? (
                    allDisputes.map((dispute) => (
                        <Link
                            legacyBehavior
                            key={dispute._id}
                            href={`/dispute/${dispute._id}`}
                            passHref
                        >
                            <a className="block border border-gray-300 rounded-lg p-4 mb-4 hover:bg-blue-100 transition">
                                <h2 className="text-xl font-semibold mb-2">
                                    Dispute ID: {dispute._id}
                                    <span className="ml-2 px-2 py-1 text-sm font-medium bg-yellow-300 text-yellow-800 rounded">
                                        {dispute.status}
                                    </span>
                                </h2>
                                <p className="text-gray-700 mb-1">
                                    <strong>Category:</strong> {dispute.category}
                                </p>
                                <p className="text-gray-700 mb-1">
                                    <strong>Description:</strong> {dispute.description}
                                </p>
                                <p className="text-gray-700 mb-1">
                                    <strong>Raised By:</strong> {dispute.raisedBy}
                                </p>
                                <p className="text-gray-700 mb-1">
                                    <strong>Preferred Resolution:</strong> {dispute.resolution}
                                </p>
                                <p className="text-gray-700 mb-1">
                                    <strong>Creation Date:</strong> {new Date(dispute.createdAt).toLocaleDateString()}
                                </p>
                                <div className="mt-2">
                                    <strong>Evidence:</strong>
                                    {dispute.evidence ? (
                                        <div className="mt-1">
                                            <img
                                                src={dispute.evidence}
                                                alt="Evidence"
                                                className="max-w-xs border rounded"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-gray-700">No evidence provided.</p>
                                    )}
                                </div>
                            </a>
                        </Link>
                    ))
                ) : (
                    <p className="text-gray-700">No disputes found.</p>
                )}
            </div>
        </>
    );
}
