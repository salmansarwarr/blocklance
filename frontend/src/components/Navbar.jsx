"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import jwt from "jsonwebtoken"; // Make sure you have jwt-decode installed
import logo from "./../../public/logo.png"
import { FaFacebookMessenger, FaInbox } from "react-icons/fa6";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const { address } = useAccount();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user = useSelector((state) => state.authReducer.user);
console.log(user)
  useEffect(() => {
    if (token) {
      const decodedToken = jwt.decode(token);
      if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
        console.log("Token has expired, redirecting to login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsTokenExpired(true);
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const navLinks = [
    {
      id: 1,
      name: user?.isSeller ? "Dashboard" : "Explore",
      link: user?.isSeller ? "/seller-dashboard" : "/all-categories",
    },
    {
      id: 1,
      name: token?  "View Disputes" : "" ,
      link: "/all-disputes" ,
    },
    {
      id: 2,
      name: "Sign In",
      link: "/login",
    },
    {
      id: 3,
      name: "Sign Up",
      link: "/signup",
    },
  ].filter((link) => {
    if (token && (link.name === "Sign In" || link.name === "Sign Up"))
      return false;
    return true;
  });

  return (
    <div className="z-50 flex justify-around py-1 items-center w-full px-4 text-black bg-white shadow-md fixed nav">
      <div>
        <a href="/">
          <img
            className="ml-0 md:ml-10 w-[70px]"
            src="/logo.png"
            alt="Blocklance Logo"
          />
        </a>
      </div>

      <ul className="hidden md:flex md:items-center">
        {navLinks.map(({ id, link, name }) => (
          <li
            key={id}
            className="nav-links px-4 cursor-pointer capitalize font-semibold text-blue-800 hover:scale-105 hover:text-blue-900 duration-200 link-underline"
          >
            <Link href={link}>{name}</Link>
          </li>
        ))}

        {token ? (
          <>
            
            <li className="nav-links px-4 cursor-pointer capitalize font-semibold text-blue-800 hover:scale-105 hover:text-blue-900 duration-200 link-underline">
              <button onClick={handleLogout}>Logout</button>
            </li>
            <li className="nav-links px-4 cursor-pointer capitalize font-semibold text-blue-800 hover:scale-105 hover:text-blue-900 duration-200 link-underline flex items-center">
              <Link legacyBehavior
                href={user?.isSeller ? "/seller-dashboard" : "/buyer-dashboard"}
              >
                <a className="flex items-center">
                  <FaUserCircle className="mr-2" size={30} />
                  {user?.name}
                </a>
              </Link>
            </li>
          </>
        ) : null}

        <li className="px-4">
          
          <ConnectKitButton />
        </li>
        <li className="nav-links px-4 cursor-pointer capitalize font-semibold text-black hover:scale-105 hover:text-black-800 duration-200 link-underline">
          <Link legacyBehavior href="/inbox">
            <a className="flex items-center">
              
              <div className="w-14 h-14 inline-flex items-center justify-center rounded-full text-white bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 ">
              <FaFacebookMessenger className="" size={24} />
                                                </div>
            </a>
          </Link>
        </li>
      </ul>

      <div
        onClick={() => setNav(!nav)}
        className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden"
      >
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>

      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500">
          {navLinks.map(({ id, link, name }) => (
            <li
              key={id}
              className="px-4 cursor-pointer capitalize py-6 text-4xl"
            >
              <Link onClick={() => setNav(!nav)} href={link}>
                {name}
              </Link>
            </li>
          ))}

          {token ? (
            <>
              <li className="px-4 cursor-pointer capitalize py-6 text-4xl flex items-center">
                <FaUserCircle className="mr-2" size={30} />
                {user?.name}
              </li>
              <li className="px-4 cursor-pointer capitalize py-6 text-4xl">
                <button
                  onClick={() => {
                    setNav(!nav);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
                
              </li>
              <li className="px-4 cursor-pointer capitalize py-6 text-4xl flex items-center">
                <FaUserCircle className="mr-2" size={30} />
                {user?.name}
              </li>
            </>
          ) : null}
        </ul>
      )}
    </div>
  );
};

export default Navbar;
