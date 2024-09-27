import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    getAllDisputes,
    getAllGigs,
    getOrdersByBuyerId,
    getOrdersByUserId,
    getUserById,
} from "@/utils/api";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { setOrders } from "@/redux/slices/orderSlice";
import { setAllDisputes } from "@/redux/slices/disputesSlice";
import { setGigs } from "@/redux/slices/gigSlice";

export const AuthGuard = ({ children }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);
    const [isTokenExpired, setIsTokenExpired] = useState(false);

    useEffect(() => {
        const publicPaths = ["/login", "/signup", "/all-categories", "/"];
        const isPublicPath =
            publicPaths.includes(pathname) ||
            /^\/gigs-by-category\/[^/]+\/\d+$/.test(pathname) ||
            /^\/about-seller\/[^/]+$/.test(pathname);

        const token = localStorage.getItem("token");

        if (!token) {
            console.log("Token not found");
            if (!isPublicPath) {
                router.push("/login");
            } else {
                setChecked(true);
            }
            return;
        }

        try {
            const decodedToken = jwt.decode(token);
            if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
                console.log("Token has expired, redirecting to login");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setIsTokenExpired(true);
                if (!isPublicPath) {
                    router.replace("/login");
                } else {
                    setChecked(true);
                }
                return;
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            if (!isPublicPath) {
                router.replace("/login");
            } else {
                setChecked(true);
            }
            return;
        }

        const fetchUserData = async () => {
            const userId = localStorage.getItem("user");
            if (!userId) {
                if (!isPublicPath) {
                    router.replace("/login");
                } else {
                    setChecked(true);
                }
                return;
            }
            try {
                const { user } = await getUserById(userId);
                let orders;
                if (user.isSeller) {
                    orders = (await getOrdersByUserId(userId));
                } else {
                    orders = (await getOrdersByBuyerId(userId));
                }
                const gigs = await getAllGigs();
                const disputes = await getAllDisputes();
                dispatch(login(user));
                dispatch(setOrders(orders));
                dispatch(setAllDisputes(disputes));
                dispatch(setGigs(gigs));
            } catch (error) {
                console.error("Error fetching user data:", error);
                if (!isPublicPath) {
                    router.replace("/login");
                }
            }
            setChecked(true);
        };

        fetchUserData();
    }, [pathname, router, dispatch]);

    if (!checked || isTokenExpired) {
        return null;
    }

    return children;
};
