"use client";
import { useEffect, useState, useContext } from "react";
import "./style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login as apiLogin } from "@/utils/api";
import { useDispatch } from "react-redux";
import { login as reduxLogin } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import jwt from "jsonwebtoken";
import "./style.css";
import Link from "next/link";

function Loader() {
    return (
        <div className="flex justify-center items-center h-screen">
            <svg
                className="animate-spin h-10 w-10 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                ></path>
            </svg>
        </div>
    );
}

function Page() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = "Blocklance | Log in";
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            const res = await apiLogin(formData);
            const decodedUser = jwt.decode(res.token);
            localStorage.setItem("token", res.token);
            localStorage.setItem("user", res.user._id);
            dispatch(reduxLogin(res.user));
            login(decodedUser, res.token);
            if (res.user.isSeller) {
                router.push("/seller-dashboard");
            } else {
                router.push("/all-categories");
            }
            toast.success("Logged in Successfully!");
        } catch (error) {
            toast.error(error.message);
        }
        setIsLoading(false);
    };

    const toggleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className="min-h-screen h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div className="flex justify-center items-center pt-10">
                        <h1 className="h1 heading text-3xl">Start your freelancing journey</h1>
                    </div>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <div className="mt-3 flex flex-col items-center">
                            <div className="w-full flex-1 mt-3">
                                <form onSubmit={handleSubmit}>
                                    <div className="mx-auto max-w-xs">
                                        <input
                                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
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
                                            className="text-sm text-blue-600 hover:underline mt-1"
                                        >
                                            {showPassword ? "Hide Password" : "Show Password"}
                                        </button>
                                        <button
                                            className="mt-5 tracking-wide font-semibold bg-blue-400 text-white-500 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                            type="submit"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m0 14v1m8-8h1M4 12H3m16.364 4.364l-.707.707m-11.314 0l-.707-.707m16.364-11.314l-.707-.707M4.636 4.636l-.707-.707" />
                                                </svg>
                                            ) : (
                                                <>
                                                    <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                                        <circle cx="8.5" cy="7" r="4" />
                                                        <path d="M20 8v6M23 11h-6" />
                                                    </svg>
                                                    <span className="ml-3">Sign In</span>
                                                </>
                                            )}
                                        </button>
                                        <p className="mt-6 text-sm text-gray-600 text-center">
                                            Not a member? <Link className="text-blue-500" href="/signup"> Sign up</Link>  now! 
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
                    <div
                        className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('how.png')" }}
                    ></div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Page;
