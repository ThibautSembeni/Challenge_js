import httpClient from '@/services/httpClient'

export async function getTransactions() {
    const response = await httpClient.get(`http://localhost:3000/eventPayment/transactions`);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la récupération des transactions`);
    }
}