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
import ProfileBuyer from "@/components/ProfileBuyer";
import Loader from "@/components/Loader";

export default function Dashboard() {
    const [selectedOption, setSelectedOption] = useState("profile");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        document.title = "Blocklance | Buyer Dashboard";
        // Simulate a loading delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000); // 1 second delay

        return () => clearTimeout(timer);
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
                return <ProfileBuyer />;
            case "orders":
                return <Orders />;
            default:
                return null;
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col md:flex-row h-screen pt-20">
            {/* Sidebar */}
            <aside
                className={`bg-gray-800 text-white w-full md:w-1/5 ${
                    sidebarOpen ? "block" : "hidden"
                }`}
            >
                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">
                        Buyer Dashboard
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
            <main className="flex-1 overflow-scroll flex flex-col  ">
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
