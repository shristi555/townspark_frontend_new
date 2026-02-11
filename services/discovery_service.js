import api from "./api";

const DiscoveryService = {
    search: async (params) => {
        return api.get("/explore/search/", { params });
    },
    getSuggestions: async (query) => {
        return api.get("/explore/suggestions/", { params: { q: query } });
    },
    getUserProfile: async (userId) => {
        return api.get(`/profile/user/${userId}/`);
    },
};

export default DiscoveryService;
