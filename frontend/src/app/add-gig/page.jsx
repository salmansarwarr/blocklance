'use client'
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { createGig } from "@/utils/api";
import { createGig as reduxCreate } from "@/redux/slices/gigSlice";
import Loader from "@/components/Loader";
import FileBase from 'react-file-base64';

export default function Page() {
    const auth = useSelector(state => state.authReducer);
    const { user } = useSelector((state) => state.authReducer);
    const dispatch = useDispatch();
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    useEffect(() => {
        if (!user.isSeller) {
            router.push('/');
        } else {
            setLoading(false);
        }
    }, [user, router]);

    const [formData, setFormData] = useState({
        userId: auth.user._id,
        title: "",
        thumbnail: "",
        category: "",
        price: "",
        description: "",
        tags: [],
        images: []
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        const res = await createGig(formData);
        console.log(res);
        dispatch(reduxCreate(res));
    };

    if (loading) {
        return <Loader />;
    }
    return (
        <section className="relative flex flex-wrap lg:h-screen lg:items-center">
            <div
                className="w-full px-4 pt-24 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24"
                data-aos="fade-up"
            >
                <div className="mx-auto max-w-lg text-center">
                    <h1 className="text-2xl font-bold sm:text-3xl">
                        Add a New Gig
                    </h1>
                    <p className="mt-4 text-gray-500">
                        Please fill out the following details to add your gig to
                        the platform.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
                    <div>
                        <label htmlFor="title" className="sr-only">Title</label>
                        <input
                            type="text"
                            id="title"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder="Title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    
                    <div>
                        <label htmlFor="category" className="sr-only">Category</label>
                        <input
                            type="text"
                            id="category"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="sr-only">Price</label>
                        <input
                            type="number"
                            id="price"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="sr-only">Description</label>
                        <textarea
                            id="description"
                            rows="4"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="tags" className="sr-only">Tags</label>
                        <input
                            type="text"
                            id="tags"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder="Tags"
                            value={formData.tags}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex items-center justify-start">
                        <button
                            type="submit"
                            className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                        >
                            Add Gig
                        </button>
                    </div>
                </form>
            </div>

            <div
                className="relative h-64 w-full mt-20 sm:h-96 lg:h-full lg:w-1/2"
                data-aos="fade-up"
            >
                <img
                    alt=""
                    src="freelance.png"
                    className="absolute inset-0 mx-auto h-full object-cover"
                />
            </div>
        </section>
    );
}