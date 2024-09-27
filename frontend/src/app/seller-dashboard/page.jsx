"use client";
import Earnings from "@/components/Earnings";
import Gigs from "@/components/Gigs";
import Orders from "@/components/Orders";
import Profile from "@/components/Profile";
import React, { useState, useEffect } from "react";
import { FaArrowAltCircleDown, FaTimes } from "react-icons/fa";
import { FaArrowDown, FaArrowUp, FaBars } from "react-icons/fa6";
import Link from "next/link";
import {
    FaUser,
    FaBriefcase,
    FaShoppingCart,
    FaMoneyBill,
    FaInbox,
} from "react-icons/fa";
export default function Dashboard() {
    const [selectedOption, setSelectedOption] = useState("profile");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        document.title = "Blocklance | Seller Dashboard";
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setSidebarOpen(true); // Sidebar is always open for screens larger than 768px
            } else {
                setSidebarOpen(false); // Close sidebar by default for smaller screens
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Call handleResize once to set initial state

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const renderComponent = () => {
        switch (selectedOption) {
            case "profile":
                return <Profile />;
            case "gigs":
                return <Gigs />;
            case "orders":
                return <Orders />;
            case "earnings":
                return <Earnings />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen pt-20">
            {/* Sidebar */}
            <aside
                className={`bg-gray-800 text-white w-full md:w-1/6 ${
                    sidebarOpen ? "block" : "hidden"
                }`}
            >
                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">
                        Seller Dashboard
                    </h2>

                    <ul className="space-y-2">
                        <li>
                            <button
                                className={`block py-2 px-4 rounded focus:outline-none ${
                                    selectedOption === "profile"
                                        ? "bg-gray-700"
                                        : ""
                                }`}
                                onClick={() => setSelectedOption("profile")}
                            >
                                <FaUser className="inline-block mr-2" /> Profile
                            </button>
                        </li>
                        <li>
                            <button
                                className={`block py-2 px-4 rounded focus:outline-none ${
                                    selectedOption === "gigs"
                                        ? "bg-gray-700"
                                        : ""
                                }`}
                                onClick={() => setSelectedOption("gigs")}
                            >
                                <FaBriefcase className="inline-block mr-2" />{" "}
                                Gigs
                            </button>
                        </li>
                        <li>
                            <button
                                className={`block py-2 px-4 rounded focus:outline-none ${
                                    selectedOption === "orders"
                                        ? "bg-gray-700"
                                        : ""
                                }`}
                                onClick={() => setSelectedOption("orders")}
                            >
                                <FaShoppingCart className="inline-block mr-2" />{" "}
                                Orders
                            </button>
                        </li>
                        <li>
                            <button
                                className={`block py-2 px-4 rounded focus:outline-none ${
                                    selectedOption === "earnings"
                                        ? "bg-gray-700"
                                        : ""
                                }`}
                                onClick={() => setSelectedOption("earnings")}
                            >
                                <FaMoneyBill className="inline-block mr-2" />{" "}
                                Earnings
                            </button>
                        </li>
                        <li>
                            <Link legacyBehavior href="/inbox">
                                <a
                                    className={`block py-2 px-4 rounded focus:outline-none ${
                                        selectedOption === "inbox"
                                            ? "bg-gray-700"
                                            : ""
                                    }`}
                                >
                                    <FaInbox className="inline-block mr-2" />{" "}
                                    Inbox
                                </a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1 overflow-scroll flex flex-col   w-full md:w-5/6 ">
                <button
                    style={{
                        top: "5rem",
                    }}
                    className="md:hidden  top-2 z-50 text-black"
                    onClick={handleToggleSidebar}
                >
                    <div
                        style={{
                            fontSize: "26px",

                            padding: "4px", // Adjust as needed
                            marginBottom: "10px",
                        }}
                    >
                        {sidebarOpen ? <FaArrowUp /> : <FaArrowDown />}
                    </div>
                    {/* Using icons instead of text */}
                    <span className="sr-only">
                        {sidebarOpen ? "Close" : "Open"} Sidebar
                    </span>{" "}
                    {/* Adding a screen reader text for accessibility */}
                </button>
                {renderComponent()}
            </main>
        </div>
    );
}
