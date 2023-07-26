import httpClient from '@/services/httpClient'

export async function createOperation(payload) {
    console.log(payload)
    const response = await httpClient.post('/operations', payload);
    return response
    // if (response.status === 200) {
    //     return response.data;
    // } else {
    //     throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la récupération des transactions`);
    // }
}

export async function getTransaction(id) {
    const response = await httpClient.get(`/transactions/${id}`);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la récupération de la transaction`);
    }
}
export async function cancelTransaction(reference) {
    const response = await httpClient.get(`/transactions/cancel/${reference}`);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la récupération de la transaction`);
    }
}
export async function getTransactionsOfUserById(id) {
    const response = await httpClient.get(`/transactions/transaction/user/${id}`);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la récupération de la transaction`);
    }
}

export async function createTransaction(transaction) {
    const response = await httpClient.post('/transactions', transaction);
    if (response.status === 201) {
        return response.data;
    } else {
        console.log(response);
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la création de la transaction`);
    }
}

export async function updateTransaction(transaction) {
    const response = await httpClient.put(`/transactions/${transaction.id}`, transaction);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la mise à jour de la transaction`);
    }
}

export async function deleteTransaction(id) {
    const response = await httpClient.delete(`/transactions/${id}`);

    if (response.status === 204) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la suppression de la transaction`);
    }
}