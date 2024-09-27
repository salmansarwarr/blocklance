"use client";
import React, { useState } from "react";
import OpenOrders from "./OpenOrders";
import CompleteOrders from "./CompleteOrders";

export default function Orders() {
    const [selectedOption, setSelectedOption] = useState("open");

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const renderComponent = () => {
        switch (selectedOption) {
            case "open":
                return <OpenOrders />;
            case "complete":
                return <CompleteOrders />;
            default:
                return null;
        }
    };

  return (
    <>
    <div className="p-8">
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-2">
          <a
            
            onClick={() => handleOptionChange("open")}
            className={`inline-block p-4 cursor-pointer ${
              selectedOption === "open"
                ? "text-blue-600  rounded-lg bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"
                : "rounded-lg hover:text-gray-600  hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Open Orders
          </a>
        </li>
        <li className="me-2">
          <a
           
            onClick={() => handleOptionChange("complete")}
            className={`inline-block p-4 cursor-pointer ${
              selectedOption === "complete"
                ? "text-blue-600 rounded-lg bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"
                : "rounded-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Completed Orders
          </a>
        </li>
      </ul>
     
      {renderComponent()}
      </div>
    </>
  );
}
