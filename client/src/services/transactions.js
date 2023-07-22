import httpClient from '@/services/httpClient'

export async function getTransactions() {
    const response = await httpClient.get('/transactions');
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la récupération des transactions`);
    }
}

export async function getTransaction(id) {
    const response = await httpClient.get(`/transactions/${id}`);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la récupération de la transaction`);
    }
}

export async function createTransaction(transaction) {
    const response = await httpClient.post('/transactions', transaction, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 201) {
        return response.data;
    } else {
        console.log(response);
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la création de la transaction`);
    }
}

export async function updateTransaction(transaction) {
    const response = await httpClient.put(`/transactions/${transaction.id}`, transaction, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
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