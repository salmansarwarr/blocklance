"use client";

import "./style.css";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdOutlineSecurity } from "react-icons/md";
import { FaCubes } from "react-icons/fa6";
import { RxLinkBreak1 } from "react-icons/rx";
import { PiIdentificationCardBold } from "react-icons/pi";
import Loader from "@/components/Loader";
import { CSSTransition } from "react-transition-group";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function page() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [searchValue, setSearchValue] = useState();

    useEffect(() => {
        document.title = "Blocklance | Home";
        AOS.init({
            duration: 1000,
            once: true,
        });
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        // window.onload = () => {
        //     setIsLoading(false);
        // };
    }, []);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div
                        className=""
                        style={{
                            backgroundImage: "url('/blockchain1.png')",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    >
                        <div className="pt-8 md:pt-28 flex flex-wrap flex-col md:flex-row items-center justify-center h-screen container mx-auto">
                            {/* Left Col for Text */}

                            <div
                                className="flex flex-col w-full xl:w-3/5 text-center justify-center items-center overflow-y-hidden"
                                data-aos="fade-up" // AOS animation attribute
                            >
                                <h1 className="heading text-3xl md:text-6xl text-white font-bold leading-tight tracking-wide text-center pt-10">
                                    Find work and <br />
                                    <span className="text-4xl md:text-5xl my-5 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-gray-100">
                                        Get Paid securely on{" "}
                                        <span className="underline">
                                            blockchain
                                        </span>
                                    </span>
                                </h1>
                                <p className="leading-normal p-3 md-p-0  text-xl mt-2 heading text-white mb-8 text-center">
                                    Blocklance: Revolutionizing freelancing with
                                    secure blockchain transactions and full work
                                    autonomy for clients and freelancers.
                                </p>

                                <form className="group mb-8 overflow-hidden">
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
        type="search"
        placeholder="Search"
        onChange={(e) => setSearchValue(e.target.value)}
        onClick={() => router.push('/all-categories')}
    />
                                </form> 

                                <div className="text-center">
                                    <Link legacyBehavior href="/all-categories">
                                        <a className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full inline-block transition duration-300 mr-4 mb-2 md:mb-0">
                                            Get Started
                                        </a>
                                    </Link>
                                    <Link legacyBehavior href="/about">
                                        <a className="text-gray-100 hover:text-blue-600 font-bold inline-block transition duration-300">
                                            Learn More
                                        </a>
                                    </Link>
                                </div>
                            </div>
                            <marquee
                                scrolldelay="50"
                                truespeed="300"
                                className="text-2xl py-10 text-white heading"
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
                        </div>
                    </div>

                    <section className="mx-4 sm:mx-10 lg:mx-36 py-6 sm:py-10 ">
                        <h1 className="text-xl sm:text-3xl font-bold mb-1.5">
                            Popular{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600">
                                Professional Services
                            </span>
                        </h1>
                        <span className="text-lg">
                          Explore Blocklance top services by its freelancers
                        </span>
                        <div className="flex text-center flex-col sm:flex-row justify-center my-5">
                            <Link href="/gigs-by-category/content-writing/1" className="relative mx-4 my-4 sm:mx-2">
                                <img
                                    className="h-64  w-[400px] object-cover rounded-md"
                                    src="blockchain1.png"
                                    alt="Writing and Content Creation"
                                />
                                <div className="absolute inset-0 bg-gray-700 opacity-60 rounded-md"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h2 className="text-white text-3xl font-bold">
                                        Writing and Content Creation
                                    </h2>
                                </div>
                            </Link>

                            <Link href="/gigs-by-category/graphic-design/1" className="text-center relative mx-4 my-4 sm:mx-2">
                                <img
                                    className="h-64  w-[400px] object-cover rounded-md"
                                    src="blockchain1.png"
                                    alt="Design and Creative Services"
                                />
                                <div className="absolute inset-0 bg-gray-700 opacity-60 rounded-md"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h2 className="text-white text-3xl font-bold">
                                        Design and Creative Services
                                    </h2>
                                </div>
                            </Link>

                            <Link href="/gigs-by-category/web-development/1" className="text-center relative mx-4 my-4 sm:mx-2">
                                <img
                                    className="h-64  w-[400px] object-cover rounded-md"
                                    src="blockchain1.png"
                                    alt="Technology and Development"
                                />
                                <div className="absolute inset-0 bg-gray-700 opacity-60 rounded-md"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h2 className="text-white text-3xl font-bold">
                                        Technology and Development
                                    </h2>
                                </div>
                            </Link>
                           
                        </div>
                        <div className="text-center">
                                    <Link legacyBehavior href="/all-categories">
                                        <a className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full inline-block transition duration-300 mr-4 mb-2 md:mb-0">
                                            View All Categories
                                        </a>
                                    </Link>
                                   
                                </div>
                    </section>
                    <section class="text-gray-600 body-font">
                        <h1 className="text-xl text-black sm:text-4xl font-bold text-center my-10">
                            How{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600">
                                Blocklance
                            </span>
                            Works?
                        </h1>
                        <div class="container px-5 sm:px-24 py-24 mx-auto flex flex-wrap mx-4  py-6 sm:py-10 ">
                            <div class="flex flex-wrap w-full">
                                <div class="lg:w-1/2 md:w-1/2  md:py-6 pl-0 sm:pl-[50px]">
                                    <div class="flex relative pb-12">
                                        <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
                                            <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
                                        </div>
                                        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 inline-flex items-center justify-center text-white relative z-10">
                                            <svg
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                class="w-5 h-5"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                            </svg>
                                        </div>
                                        <div class="flex-grow pl-4">
                                            <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">
                                                STEP 1
                                            </h2>
                                            <p class="leading-relaxed">
                                            Request Services: The buyer uses the platform to request services.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex relative pb-12">
                                        <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
                                            <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
                                        </div>
                                        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 inline-flex items-center justify-center text-white relative z-10">
                                            <svg
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                class="w-5 h-5"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                            </svg>
                                        </div>
                                        <div class="flex-grow pl-4">
                                            <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">
                                                STEP 2
                                            </h2>
                                            <p class="leading-relaxed">
                                            Facilitate Communication: Seamless communication is established between the buyer and seller without third-party intervention.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex relative pb-12">
                                        <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
                                            <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
                                        </div>
                                        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 inline-flex items-center justify-center text-white relative z-10">
                                            <svg
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                class="w-5 h-5"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="5"
                                                    r="3"
                                                ></circle>
                                                <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
                                            </svg>
                                        </div>
                                        <div class="flex-grow pl-4">
                                            <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">
                                                STEP 3
                                            </h2>
                                            <p class="leading-relaxed">
                                            Complete the Order: The buyer and seller complete the order.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex relative pb-12">
                                        <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
                                            <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
                                        </div>
                                        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 inline-flex items-center justify-center text-white relative z-10">
                                            <svg
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                class="w-5 h-5"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                                                <circle
                                                    cx="12"
                                                    cy="7"
                                                    r="4"
                                                ></circle>
                                            </svg>
                                        </div>
                                        <div class="flex-grow pl-4">
                                            <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">
                                                STEP 4
                                            </h2>
                                            <p class="leading-relaxed">
                                            Secure Transaction: A secure transaction is made on the blockchain upon order completion.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex relative">
                                        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 inline-flex items-center justify-center text-white relative z-10">
                                            <svg
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                class="w-5 h-5"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                                                <path d="M22 4L12 14.01l-3-3"></path>
                                            </svg>
                                        </div>
                                        <div class="flex-grow pl-4">
                                            <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">
                                                FINISH
                                            </h2>
                                            <p class="leading-relaxed">
                                            Resolve Disputes: If any conflicts arise, a dispute resolver is available.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[600px] flex justify-center items-center">
                                    <img class="" src="how.png" alt="step" />
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="bg-white">
                        <div className="mx-4 sm:mx-10 lg:mx-36 py-6 sm:py-10">
                            <h1 className="text-xl sm:text-4xl font-bold mb-1.5">
                                Join the{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600">
                                    future of work
                                </span>
                            </h1>
                            <span className="text-lg">
                                Get your project done on time by highly skilled
                                professionals
                            </span>
                        </div>

                        <div className="container px-4 sm:px-5 mx-auto">
                            <section className="text-gray-600 body-font text-center">
                                <div className="container px-4 sm:px-36 mx-auto">
                                    <div className="flex flex-wrap -m-4">
                                        {/* <!-- Card 1 --> */}
                                        <div className="lg:w-1/2 xl:w-1/4 md:w-1/2 p-4 sm:p-6">
                                            <div className="border border-gray-200 p-6 rounded-lg">
                                                <div className="w-14 h-14 inline-flex items-center justify-center rounded-full text-white bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 mb-4">
                                                    <FaCubes className="text-4xl" />
                                                </div>
                                                <h2 className="text-md text-gray-900 font-semibold title-font mb-2">
                                                    Decentralized Platforms
                                                </h2>
                                                <p className="leading-relaxed text-sm">
                                                    Make it easier for
                                                    freelancers to find work and
                                                    for clients to find skilled
                                                    professionals, regardless of
                                                    their location.
                                                </p>
                                            </div>
                                        </div>
                                        {/* <!-- Card 2 --> */}
                                        <div className="lg:w-1/2 xl:w-1/4 md:w-1/2 p-4 sm:p-6">
                                            <div className="border border-gray-200 p-6 rounded-lg">
                                                <div className="w-14 h-14 inline-flex items-center justify-center rounded-full  text-white bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 mb-4">
                                                    <PiIdentificationCardBold className="text-4xl" />
                                                </div>
                                                <h2 className="text-md text-gray-900 font-semibold title-font mb-2">
                                                    Greater Transparency
                                                </h2>
                                                <p className="leading-relaxed text-sm">
                                                    Provide a transparent record
                                                    of all transactions, which
                                                    can help to build trust
                                                    between freelancers and
                                                    clients.
                                                </p>
                                            </div>
                                        </div>
                                        {/* <!-- Card 3 --> */}
                                        <div className="lg:w-1/2 xl:w-1/4 md:w-1/2 p-4 sm:p-6">
                                            <div className="border border-gray-200 p-6 rounded-lg">
                                                <div className="w-14 h-14 inline-flex items-center justify-center rounded-full text-white bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 mb-4">
                                                    <MdOutlineSecurity className="text-4xl" />
                                                </div>
                                                <h2 className="text-md text-gray-900 font-semibold title-font mb-2">
                                                    Increased Security
                                                </h2>
                                                <p className="leading-relaxed text-sm">
                                                    Assure that transactions are
                                                    secure and cannot be
                                                    tampered with by using a
                                                    decentralized platform.
                                                </p>
                                            </div>
                                        </div>
                                        {/* <!-- Card 4 --> */}
                                        <div className="lg:w-1/2 xl:w-1/4 md:w-1/2 p-4 sm:p-6">
                                            <div className="border border-gray-200 p-6 rounded-lg">
                                                <div className="w-14 h-14 inline-flex items-center justify-center rounded-full text-white bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 mb-4">
                                                    <RxLinkBreak1 className="text-4xl" />
                                                </div>
                                                <h2 className="text-md text-gray-900 font-semibold title-font mb-2">
                                                    Eliminate Intermediaries
                                                </h2>
                                                <p className="leading-relaxed text-sm">
                                                    Record and facilitate
                                                    transactions using smart
                                                    contracts on a blockchain,
                                                    eliminating the need for
                                                    intermediaries.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>

                    <section className=" mx-10 sm:mx-36 py-10 sm:py-10">
                        <div class="relative  mx-auto mt-20">
                            <img
                                class="h-64 w-full object-cover rounded-md"
                                src="blockchain1.png"
                                alt="Blockchain image"
                            />
                            <div class="absolute inset-0  bg-gray-500 opacity-30 rounded-md"></div>
                            <div class="absolute inset-0  text-center flex items-center justify-center">
                                <h2 class="text-white p-3 text-lg sm:text-2xl opacity-100 font-medium heading tracking-wide">
                                    By using the blockchain to record and
                                    facilitate payments, freelancers and clients
                                    can have greater confidence in the security
                                    and integrity of the payment process.
                                </h2>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </>
    );
}
