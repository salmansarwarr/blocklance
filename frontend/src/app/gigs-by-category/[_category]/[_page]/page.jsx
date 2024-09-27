"use client";
import React, { useEffect, useState } from "react";
import "./style.css";
import { FaArrowDown } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { getGigsByCategory } from "@/utils/api";
import Link from "next/link";

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [data, setData] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [sortOption, setSortOption] = useState("");

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSort = (option) => {
        setSortOption(option);
        setIsOpen(false);
    };

    useEffect(() => {
        document.title = "Blocklance | Categories By Gigs";
    }, []);

    useEffect(() => {
        const getData = async () => {
            const query = pathname.split("/")[2];
            const pageNo = pathname.split("/")[3];
            setCategoryName(query);
            const { results } = await getGigsByCategory(query, pageNo);
            setData(results);
        };
        getData();
    }, [pathname]);

    useEffect(() => {
        if (sortOption) {
            const sortedData = [...data].sort((a, b) => {
                if (sortOption === "Name") {
                    return a.title.localeCompare(b.title);
                } else if (sortOption === "Date") {
                    return new Date(b.createdDate) - new Date(a.createdDate);
                }
                return 0;
            });
            setData(sortedData);
        }
    }, [sortOption]);

    const capitalizeWords = (str) => {
        return str
            .replaceAll("-", " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-6 sm:px-24 py-32 sm:py-24 mx-auto">
                <div className="h-[250px] mb-6 bgsvg flex items-center">
                    <h1 className="text-left h1 px-10 text-2xl sm:text-3xl font-bold text-white">
                        Explore Blocklance's top gigs <br />
                        <span className="h4 text-lg sm:text-xl text-white font-thin">
                            Unreal works made by real Blocklance freelancers{" "}
                        </span>
                    </h1>
                </div>
                <h1 className="text-2xl mb-5 font-semibold md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600">
                    {capitalizeWords(categoryName)}
                </h1>

                <div>
                    

                    <div className="flex flex-wrap -m-4 mt-8">
                        {data?.map((gig) => (
                            <div className="p-4 md:w-1/3" key={gig._id}>
                                <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                                    <img
                                        className="lg:h-48 md:h-36 w-full object-cover object-center"
                                        src={gig.thumbnail}
                                        alt={gig.title}
                                    />
                                    <div className="p-6">
                                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                            Gig
                                        </h2>
                                        <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                            {gig.title}
                                        </h1>
                                        <p className="leading-relaxed mb-3">
                                            {gig.description}
                                        </p>
                                        <div className="flex items-center flex-wrap">
                                            <Link
                                                href={`/gig/${gig._id}`}
                                                className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0"
                                            >
                                                More details
                                                <svg
                                                    className="w-4 h-4 ml-2"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M5 12h14"></path>
                                                    <path d="M12 5l7 7-7 7"></path>
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
