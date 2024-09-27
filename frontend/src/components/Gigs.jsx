import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import Loader from "@/components/Loader"; // Import Loader component

export default function Gigs() {
    const { user } = useSelector((state) => state.authReducer);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        // Simulate fetching gigs data (replace with actual fetching logic)
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    const { gigs } = useSelector((state) => state.gigReducer);

    return (
        <>
            <h1 className="pt-5 pl-6 text-2xl font-semibold">Active Gigs</h1>
            {isLoading ? (
                <Loader /> // Render Loader while fetching gig data
            ) : (
                <div class="flex flex-wrap pl-10 -m-4 mt-2">
                    {gigs && gigs?.length > 0 ? (
                        gigs
                            .filter((gig) => gig.userId == user?._id)
                            .map((gig) => (
                                <Link href={`/gig/${gig._id}`} class="p-4 md:w-1/3" key={gig._id}>
                                <div class="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden hover:bg-blue-100 transition ">
                                    <img
                                        class="lg:h-48 md:h-36 w-full object-cover object-center"
                                        src={gig.thumbnail}
                                        alt={gig.title}
                                    />
                                    <div class="p-6">
                                        <h2 class=" heading text-lg title-font font-bold text-black 0 mb-1">
                                            {gig.title}
                                        </h2>
                                        <h1 class="tracking-wide title-font text-sm font-medium text-gray-800 mb-3">
                                        {gig.description.slice(0, 100)}... 
                                        </h1>
                                    </div>
                                </div>
                            </Link>
                            ))
                    ) : (
                        <h1>No active gigs</h1>
                    )}
                </div>
            )}
            <div className="flex m-4 justify-end items-end">
                <Link href="/add-gig">
                    {" "}
                    <button
                        type="submit"
                        className="rounded-lg flex bg-blue-500 p-3 text-sm font-medium text-white ml-auto"
                    >
                        <FaPlus className="mt-1 mr-1" /> Add More Gigs
                    </button>
                </Link>
            </div>
        </>
    );
}
