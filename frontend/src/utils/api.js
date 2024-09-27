import axios from "axios";

const devUrl = "http://localhost:3001/";
const mainUrl = "https://blocklance-server.vercel.app/";

const API = axios.create({ baseURL: mainUrl });

API.interceptors.request.use((req) => {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return req;
});

export const register = async (user) => {
    try {
        const response = await API.post(`/auth/register`, user);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

export const login = async (user) => {
    try {
        const response = await API.post(`/auth/login`, user);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

export const getUserById = async (id) => {
    try {
        const response = await API.get(`/auth/users/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

export const getUserByEmail = async (email) => {
    try {
        const response = await API.get(`/auth/getUserByEmail/${email}`);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateUserById = async (details) => {
    try {
        const response = await API.post(`/auth/updateUser`, details);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

export const createGig = async (gig) => {
    try {
        const response = await API.post(`/gigs`, gig);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

export const getAllGigs = async () => {
    try {
        const response = await API.get(`gigs`);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const getGigById = async (id) => {
    try {
        const response = await API.get(`/gigs/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

export const getGigsByUserId = async (id) => {
    try {
        const response = await API.get(`/gigs/users/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

export const getGigsByCategory = async (query, page) => {
    try {
        const response = await API.get(`/gigs/searchByCategory/${query}/${page}`);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

export const getOrdersByUserId = async (id) => {
    try {
        const response = await API.get(`order/seller/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

export const getOrdersByBuyerId = async (id) => {
    try {
        const response = await API.get(`order/buyer/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};


export const getAllDisputes = async () => {
    try {
        const response = await API.get(`disputes`);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}


export const counterProof = async (id,proofs) => {
    try {
        const response = await API.post(`disputes/counterproof/${id}`,proofs);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const getDisputeById = async (id) => {
    try {
        const response = await API.get(`disputes/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}


export const updateDispute = async (id, dispute) => {
    try {
        const response = await API.put(`disputes/${id}`, dispute);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}


export const createDispute = async ( dispute) => {
    try {
        const response = await API.post(`disputes`, dispute);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const createOffer = async (offer) => {
    try {
        const response = await API.post(`offer`, offer);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const getOfferByBuyerAndSeller = async (buyerId, sellerId) => {
    try {
        const response = await API.get(`offer/buyer/${buyerId}/seller/${sellerId}`);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const getOfferByUser = async (userId) => {
    try {
        const response = await API.get(`offer/user/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const createOrder = async (gigId, data) => {
    console.log(`order/createOrder/${gigId}`)
    try {
        const response = await API.post(`order/createOrder/${gigId}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const deleteOffer = async (id) => {
    try {
        const response = await API.delete(`offer/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

