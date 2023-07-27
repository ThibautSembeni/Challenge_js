import httpClient from '@/services/httpClient'

export async function getOrders() {
    const response = await httpClient.get('/orders');
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la récupération des commandes`);
    }
}

export async function getOrder(id) {
    const response = await httpClient.get(`/orders/${id}`);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la récupération de la commande`);
    }
}

export async function createOrder(order) {
    const response = await httpClient.post('/orders', order);
    if (response.status === 201) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la création de la commande`);
    }
}