"use client";
import React, { useState, useEffect } from "react";
import "./style.css";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { register } from "@/utils/api";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

// Define the Page component
function Page() {
    // Initialize state variables
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { address } = useAccount();
    const router = useRouter();

    const [formData, setFormData] = useState({
        address: address || "",
        name: "",
        email: "",
        password: "",
        phone: "",
        isSeller: false,
    });

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle role selection change
    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setFormData({ ...formData, isSeller: e.target.value === "seller" });
    };

    // Toggle password visibility
    const toggleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true
        try {
            await register(formData);
            toast.success("Registered Successfully!");
            router.push("/login");
        } catch (error) {
            toast.error(error.message);
        }
        setIsLoading(false); // Set loading state to false
    };

    // Set document title on component mount
    useEffect(() => {
        document.title = "Blocklance | Sign up";
    }, []);


    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div className="flex justify-center items-center pt-10">
                        <h1 className="h1 heading text-3xl">Join Blocklance, Now!</h1>
                    </div>
                    {isLoading ? (
                        <Loader />
                    ) : (
                    <div className="mt-3 flex flex-col items-center">
                        <div className="w-full flex-1 mt-3">
                            <form onSubmit={handleSubmit}>
                                <div className="mx-auto max-w-xs">
                                   
                                    <input
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    <input
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <input
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    
                                    <button
                                        type="button"
                                        onClick={toggleShowPassword}
                                        className="text-sm text-blue-600 hover:underline my-1"
                                    >
                                        {showPassword ? "Hide Password" : "Show Password"}
                                    </button>
                                    <input
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                    <input
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                        type="text"
                                        name="phone"
                                        placeholder="Phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    <select
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                        name="role"
                                        value={role}
                                        onChange={handleRoleChange}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="buyer">Buyer</option>
                                        <option value="seller">Seller</option>
                                    </select>
                                    <button
                                        className="mt-5 tracking-wide font-semibold bg-blue-400 text-white-500 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                        type="submit"
                                    >
                                        <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                            <circle cx="8.5" cy="7" r="4" />
                                            <path d="M20 8v6M23 11h-6" />
                                        </svg>
                                        <span className="ml-3">Sign Up</span>
                                    </button>
                                    <p className="mt-6 text-sm text-gray-600 text-center">
                                            Already a member? <Link className="text-blue-500" href="/login"> Login</Link>  now! 
                                        </p>
                                    <p className="mt-6 text-xs text-gray-600 text-center">
                                        I agree to abide by Blocklance &nbsp;
                                        <a href="#" className="border-b border-gray-500 border-dotted">
                                            Terms of Service &nbsp;
                                        </a>
                                        and its &nbsp;
                                        <a href="#" className="border-b border-gray-500 border-dotted">
                                            Privacy Policy
                                        </a>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                    )}
                </div>
                <div className="flex-1 bg-blue-100 text-center hidden lg:flex">
                    <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('how.png')" }}
                    >
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Page;
