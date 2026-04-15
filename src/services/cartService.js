import api2 from "./api2";

export const cartService = {
    getAll: () => api2.get('/carts'),
    
    create: (data) => api2.post('/carts', data),

    update: (id, data) => api2.put(`/carts/${id}`, data),

    delete: (id) => api2.delete(`/carts/${id}`),
};