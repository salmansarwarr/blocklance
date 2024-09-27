"use client";
import React, { useEffect, useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import "./style.css";
import { useSelector } from "react-redux";
import Link from "next/link";
import Loader from "@/components/Loader";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const { gigs } = useSelector((state) => state.gigReducer);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        document.title = "Blocklance | Categories By Gigs";
        AOS.init({
            duration: 1000, // duration of the animation
            // once, // whether animation should happen only once - while scrolling down
        });
        setTimeout(() => {
            setLoading(false);
        }, 2000); // Set this to the duration of your API call
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredGigs = gigs.filter((gig) =>
        gig.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <Loader />;
    }

    return (
        <section className="text-gray-600 body-font bg-gray-100">
            <div className="container px-6 sm:px-24 py-32 sm:py-24 mx-auto ">
                <div className="h-[250px] bgsvg flex items-center rounded">
                    <h1 className="text-left h1 px-10 text-xl sm:text-3xl font-bold text-white">
                        Explore Blocklance's top services <br />
                        <span className="h4 text-md sm:text-xl text-white font-thin">
                            Unreal works made by real Blocklance freelancers{" "}
                        </span>
                    </h1>
                </div>
                <marquee
                    scrolldelay="50"
                    truespeed="300"
                    className="text-2xl py-8 text-white heading"
                    direction="right"
                >
                    <span className="outline-tag-btn mx-[3rem]">
                        Web Development
                    </span>
                    <span className="outline-tag-btn mx-[3rem]">
                        App Development
                    </span>
                    <span className="outline-tag-btn mx-[3rem]">
                        Blockchain
                    </span>
                    <span className="outline-tag-btn mx-[3rem]">
                        UI/UX Design
                    </span>
                    <span className="outline-tag-btn mx-[3rem]">
                        Data Science
                    </span>
                    <span className="outline-tag-btn mx-[3rem]">
                        Artificial Intelligence
                    </span>
                    <span className="outline-tag-btn mx-[3rem]">
                        Web Development
                    </span>
                    <span className="outline-tag-btn mx-[3rem]">
                        App Development
                    </span>
                    <span className="outline-tag-btn mx-[3rem]">
                        Blockchain
                    </span>
                    <span className="outline-tag-btn mx-[3rem]">
                        UI/UX Design
                    </span>
                    <span className="outline-tag-btn mx-[3rem]">
                        Data Science
                    </span>
                    <span className="outline-tag-btn mx-[3rem]">
                        Artificial Intelligence
                    </span>
                </marquee>
                <div className="py-6 flex justify-center items-center">
                   
                       <form className="group overflow-hidden  ">
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="icon"
                                    >
                                        <g>
                                            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                                        </g>
                                    </svg>
                                    <input
                                        className="input w-25 md:w-[600px]"
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="Search gigs..."
                                    />
                                </form> 
                </div>
                <div>
                    <div className="flex flex-wrap -m-4 mt-8">
                        {filteredGigs.length > 0 ? (
                            filteredGigs.map((gig) => (
                                <div
                                    className="p-10 md:w-1/3"
                                    key={gig._id}
                                    data-aos="fade-up"
                                >
                                    <Link legacyBehavior href={`/gig/${gig._id}`}>
                                        <a className="block h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-100">
                                            <img
                                                className="lg:h-48 md:h-36 w-full object-cover object-center"
                                                src={gig.thumbnail}
                                                alt="blog"
                                            />
                                            <div className="p-6">
                                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                                    {gig.category}
                                                </h2>
                                                <h1 className="title-font text-lg font-bold text-gray-900 mb-3">
                                                    {gig.title}
                                                </h1>
                                                <p className="leading-relaxed mb-3 text-sm">
                                                    {gig.description.slice(0, 80)}
                                                    {gig.description.length > 80 && "..."}
                                                </p>
                                                <div className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">
                                                    Learn More
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
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="w-full text-center p-6">
                                <p className="text-gray-500 text-xl">Login to see all gigs</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
