import api from "./api";

const AdminService = {
    /**
     * Get dashboard summary stats
     */
    async getDashboardStats() {
        const data = await api.get("/administration/stats/");
        return data.response;
    },

    async verifyAdmin() {
        const data = await api.get("/administration/verify/");
        return data.response;
    },

    /**
     * USERS MANAGEMENT
     */
    async getUsers(params = {}) {
        const data = await api.get("/administration/users/", { params });
        return data.response;
    },

    async getUserDetails(id) {
        const data = await api.get(`/administration/users/${id}/`);
        return data.response;
    },

    async updateUser(id, userData) {
        const data = await api.patch(`/administration/users/${id}/`, userData);
        return data.response;
    },

    /**
     * ISSUES MANAGEMENT
     */
    async getIssues(params = {}) {
        const data = await api.get("/administration/issues/", { params });
        return data.response;
    },

    async updateIssue(id, issueData) {
        const data = await api.patch(`/administration/issues/${id}/`, issueData);
        return data.response;
    },

    /**
     * TESTIMONIALS MODERATION
     */
    async getTestimonials(params = {}) {
        const data = await api.get("/administration/testimonials/", { params });
        return data.response;
    },

    async updateTestimonial(id, testimonialData) {
        const data = await api.patch(`/administration/testimonials/${id}/`, testimonialData);
        return data.response;
    },

    async deleteTestimonial(id) {
        const data = await api.delete(`/administration/testimonials/${id}/`);
        return data.response;
    }
};

export default AdminService;
