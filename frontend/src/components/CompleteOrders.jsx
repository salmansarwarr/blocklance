"use client";

import { getGigById, getUserById } from "@/utils/api";
import { useSelector } from "react-redux";

export default function OpenOrders() {
    const { orders } = useSelector((state) => state.orderReducer);

    const getClient = async (id) => {
        const { user } = await getUserById(id);
        return user;
    };

    const getGig = async (id) => {
        const { user } = await getGigById(id);
        return user;
    };

    return (
        <>
            <section class="py-10">
                <div class="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
                    {orders && orders.length > 0 ? (
                        orders.map((order) => {
                            const client = getClient(order.buyerId);
                            const gig = getGig(order.gigId);

                            !order?.isCompleted && (
                                <div class="main-box border border-gray-200 rounded-xl pt-6 max-w-xl max-lg:mx-auto lg:max-w-full ">
                                    <div class="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200">
                                        <div class="data">
                                            <p class="font-semibold text-base leading-7 text-black">
                                                Order Id:{" "}
                                                <span class="text-indigo-600 font-medium">
                                                    {order._id}
                                                </span>
                                            </p>
                                            <p class="font-semibold text-base leading-7 text-black mt-4">
                                                Order Payment :{" "}
                                                <span class="text-gray-400 font-medium">
                                                    {" "}
                                                    {order.creationDate}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="w-full px-3 min-[400px]:px-6">
                                        <div class="flex flex-col lg:flex-row items-center py-6 border-b border-gray-200 gap-6 w-full">
                                            <div class="img-box max-lg:w-full">
                                                <img
                                                    src={gig.thumbnail}
                                                    alt="Premium Watch image"
                                                    class="aspect-square w-full lg:max-w-[140px]"
                                                />
                                            </div>
                                            <div class="flex flex-row items-center w-full ">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 w-full">
                                                    <div class="flex items-center">
                                                        <div class="">
                                                            <h2 class="font-semibold text-xl leading-8 text-black mb-3">
                                                                {order.name}
                                                            </h2>
                                                            <p class="font-normal text-lg leading-8 text-gray-500 mb-3 ">
                                                                {client.name}
                                                            </p>
                                                            {/* <div class="flex items-center ">
                          <p class="font-medium text-base leading-7 text-black pr-4 mr-4 border-r border-gray-200">
                            Size: <span class="text-gray-500">100 ml</span>
                          </p>
                          <p class="font-medium text-base leading-7 text-black ">
                            Qty: <span class="text-gray-500">2</span>
                          </p>
                        </div> */}
                                                        </div>
                                                    </div>
                                                    <div class="grid grid-cols-5">
                                                        <div class="col-span-5 lg:col-span-1 flex items-center max-lg:mt-3">
                                                            <div class="flex gap-3 lg:block">
                                                                <p class="font-medium text-sm leading-7 text-black">
                                                                    Price
                                                                </p>
                                                                <p class="lg:mt-4 font-medium text-sm leading-7 text-indigo-600">
                                                                    $
                                                                    {
                                                                        order.price
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div class="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3 ">
                                                            <div class="flex gap-3 lg:block">
                                                                <p class="font-medium text-sm leading-7 text-black">
                                                                    Status
                                                                </p>
                                                                <p class="font-medium text-sm leading-6 whitespace-nowrap py-0.5 px-3 rounded-full lg:mt-3 bg-emerald-50 text-emerald-600">
                                                                    Completed
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div class="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3">
                                                            <div class="flex gap-3 lg:block">
                                                                <p class="font-medium text-sm whitespace-nowrap leading-6 text-black">
                                                                    Expected
                                                                    Delivery
                                                                    Time
                                                                </p>
                                                                <p class="font-medium text-base whitespace-nowrap leading-7 lg:mt-3 text-emerald-500">
                                                                    {
                                                                        order.deadline
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <h1>No Completed orders</h1>
                    )}
                </div>
            </section>
        </>
    );
}
