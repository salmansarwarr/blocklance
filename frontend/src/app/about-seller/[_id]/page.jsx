"use client";

import { getUserById } from "@/utils/api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUserCircle, FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import './style.css';
import Loader from "@/components/Loader";


export default function Page() {
    const pathname = usePathname();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true); // State to manage loading

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const getData = async () => {
            const id = pathname.split("/")[2];
            try {
                const res = await getUserById(id);
                setUser(res.user);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };
        getData();
    }, [pathname]);

    if (loading) {
        return <Loader />; // Show loader while loading is true
    }

    return (
        <div className="bg-gray-100">
            <div className="container mx-auto py-24">
                <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                    <div className="col-span-4 sm:col-span-3">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex flex-col items-center">
                                <img
                                    src={user?.details?.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8jPHSzKsdX6LxEaqenpFT7zs5b-FHZBfc_Uune1-t6wZbjwCcA-UNvNKgAxS1XIq1iGA&usqp=CAU"}
                                    className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                                />
                                <h1 className=" h1 text-xl heading font-bold">
                                    {user?.name}
                                </h1>
                                <p className="text-gray-700 py-2">
                                    <strong>Rating:</strong> {user?.details?.rating} ({user?.details?.numberOfReviews} reviews)
                                </p>
                                <p className="text-gray-700 py-2">{user?.details?.tagline}</p>
                                <p className="text-black font-semibold flex items-center">
                                    Profile Created At: {user?.createdAt ? formatDate(user.createdAt) : ''}
                                </p>
                                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                    <Link
                                        href={`/inbox/${user?._id}`}
                                        className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                    >
                                        Contact
                                    </Link>
                                </div>
                            </div>
                            <hr className="my-6 border-t border-gray-300" />
                            <div className="mt-6">
                                <h2 className="text-xl h2 font-bold mb-4 heading">Additional Information</h2>
                                <p className="text-gray-700 py-2">
                                    <strong>Country:</strong> {user?.details?.country}
                                </p>
                                <p className="text-gray-700 py-2">
                                    <strong>Languages:</strong> {user?.details?.languages?.join(", ")}
                                </p>
                                <p className="text-gray-700 py-2">
                                    <strong>Earnings:</strong> ${user?.details?.earning}
                                </p>
                                <p className="text-gray-700 py-2">
                                    <strong>Additional Details:</strong> {user?.details?.additionalDetail1}, {user?.details?.additionalDetail2}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-4 sm:col-span-9">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl h2 font-bold mb-4 heading">About Me</h2>
                            <p className="text-gray-700">
                                {user?.details?.about}
                            </p>
                            <div className="flex flex-col mt-4">
                                <span className="text-black heading py-4 text-xl font-bold tracking-wider mb-2">
                                    Experience
                                </span>
                                <ul>
                                    {user?.details?.experience?.map((exp, index) => (
                                        <li key={index} className="mb-2">{exp}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-black text-xl py-4 heading  font-bold tracking-wider mb-2">
                                    Skills
                                </span>
                                <ul>
                                    {user?.details?.skills?.map((skill, index) => (
                                        <li key={index} className="mb-2">{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
