"use client";

import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getGigById, getUserById } from "@/utils/api";
import Loader from "@/components/Loader";

import './style.css'
export default function Page() {
    const pathname = usePathname();
    const [gig, setGig] = useState();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true)
    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    };

    useEffect(() => {
        const getData = async () => {
            const id = pathname.split("/")[2];
            try {
                const res = await getGigById(id);
                console.log(res)
                const {user} = await getUserById(res.userId);
                setGig(res);
                setUser(user);
                console.log(user)
                setTimeout(() => {
                    setLoading(false);
                }, 500); // Set this to the duration of your API call
        
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [pathname]);
if(loading) return <Loader />
    return (
        <>
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-32 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap ">
                        <div className="lg:w-1/2 w-full sm:mt-16 lg:pr-10">
                            <img
                                alt="ecommerce"
                                className="w-full h-auto object-cover object-center rounded"
                                src={gig?.thumbnail}
                            />
                          <div className="py-10">
    <h1 className="text-2xl font-semibold text-black">
        About the Seller
    </h1>
    <div className="p-4 pt-10">
        <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
            <img
                alt="team"
                className="flex-shrink-0 rounded-full w-48 h-48 object-cover object-center sm:mb-0 mb-4"
                src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8jPHSzKsdX6LxEaqenpFT7zs5b-FHZBfc_Uune1-t6wZbjwCcA-UNvNKgAxS1XIq1iGA&usqp=CAU"}
            />
            <div className="lg:w-1/2 sm:pl-8">
                <h2 className="title-font font-medium text-lg text-gray-900">
                    {user?.name}
                </h2>
                <p className="mb-4">
                    {user?.details?.about}
                </p>
                <p className="mb-4">
                    <strong>Country:</strong> {user?.details?.country}
                </p>
                
                <p className="mb-4">
                    <strong>Rating:</strong> {user?.details?.rating} ({user?.details?.numberOfReviews} reviews)
                </p>
                
                <p className="mb-4">
                    <strong>Experience:</strong> {user?.details?.experience?.join(", ")}
                </p>
               
               
            </div>
        </div>
        <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
            <Link legacyBehavior href={`/about-seller/${user?._id}`}>
                <a className="flex text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded">
                    More about seller <FaArrowRight className="mt-1 ml-1" />
                </a>
            </Link>
        </div>
    </div>
</div>

                        </div>
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            <h2 className="text-md title-font text-gray-700 tracking-widest">
                               About this Gig
                            </h2>

                            <div className="flex my-4">
                                <span className="title-font font-bold text-2xl text-gray-900">
                                   Price: {gig?.price} ETH
                                </span>
                            </div>
                            <div className=" border-b-2 border-gray-100 my-4"></div>
                            <h2 className="text-2xl font-semibold text-black pb-2">
                            {gig?.title}
                            </h2>
                            <p className="leading-relaxed">
                                {gig?.description}
                            </p>
                            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                                <Link href={`/inbox/${user?._id}`}>
                                    <button class="flex  text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded">
                                        Continue{" "}
                                        <FaArrowRight className="mt-1 ml-1" />{" "}
                                    </button>
                                </Link>
                            </div>

                             <div className="flex py-4">
            {gig?.tags?.map((tag) => (
                <button key={tag} className="outline-tag-btn mr-3">
                    {toTitleCase(tag)}
                </button>
            ))}
        </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
