import React from "react";
import { FaEnvelope, FaFacebook, FaGlobe, FaYoutube } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer class="bg-gray-900 py-3">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="flex flex-col items-center justify-center mb-8 md:mb-0">
            <img
              class="mb-5"
              src="logo.png"
              height="150px"
              width="150px"
              alt="Logo"
            />
            <div class="social-media flex gap-2"></div>
          </div>

          <div class="flex text-center sm:text-left flex-col items-center justify-center">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className=" hidden sm:block">
                <h2 class="mb-6 sm:text-xl text-lg font-bold text-white uppercase">
                  Links
                </h2>
                <ul class="text-sm text-white">
                  <li class="mb-4">
                    <a href="/">About</a>
                  </li>
                  <li class="mb-4">
                    <a href="/services">Services</a>
                  </li>
                  <li class="mb-4">
                    <a href="/portfolio">Categories</a>
                  </li>
                 
                </ul>
              </div>
              <div>
                <h2 class="mb-6 sm:text-xl text-lg font-bold text-white uppercase">
                  Contact us
                </h2>
                <ul className="text-sm text-white">
                  <li className="mb-4 flex items-center">
                    <a
                      href="https://www.blocklance.com"
                      className="flex items-center"
                    >
                      <FaGlobe className="text-white me-2" />
                      <span className="ml-2">www.blocklance.com</span>
                    </a>
                  </li>
                  <li className="mb-4 flex items-center">
                    <a
                      href="https://www.facebook.com/blocklance"
                      className="flex items-center"
                    >
                      <FaFacebook className="text-white me-2" />
                      <span className="ml-2">Blocklance</span>
                    </a>
                  </li>
                  <li className="mb-4 flex items-center">
                    <a
                      href="mailto:info@blocklance.com"
                      className="flex items-center"
                    >
                      <FaEnvelope className="text-white me-2" />
                      <span className="ml-2">info@blocklance.com</span>
                    </a>
                  </li>
                  
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="text-center  text-sm text-white px-4 mt-4">
        Copyright © 2024 Created By{" "}
        <a href="https://gennovativesolutions.tech">
          gennovative solutions
        </a>
        , All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
