import api from "./api";

const LandingService = {
    /**
     * Get real-time stats and testimonials for the landing page
     */
    async getLandingData() {
        try {
            const data = await api.get("/testimonials/landing-data/");
            return data.response;
        } catch (error) {
            console.error("Failed to fetch landing data:", error);
            // Return fallback dummy data in case of error
            return {
                stats: {
                    total_users: 100,
                    issues_resolved: 150,
                    cities_connected: 10,
                    avg_response_time_hrs: 48.0
                },
                testimonials: []
            };
        }
    },

    /**
     * Get the current user's rating/testimonial
     */
    async getMyRate() {
        try {
            const data = await api.get("/testimonials/rate/");
            return data.response;
        } catch (error) {
            // If 404, user hasn't rated yet
            if (error.status === 404) return null;
            throw error;
        }
    },

    /**
     * Post a new rating for the platform
     */
    async postRate(rateData) {
        const data = await api.post("/testimonials/rate/", rateData);
        return data.response;
    },

    /**
     * Update an existing rating for the platform
     */
    async patchRate(rateData) {
        const data = await api.patch("/testimonials/rate/", rateData);
        return data.response;
    }
};

export default LandingService;
