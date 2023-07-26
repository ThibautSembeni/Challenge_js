import httpClient from '@/services/httpClient'
import eventPayment from '@/services/eventPayment'
export async function getTransactionsOfUserById(id) {
    const response = await httpClient.get(`/transactions/transaction/user/${id}`);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la récupération de la transaction`);
    }
}

export async function getTransactions() {
    return await eventPayment.getAllTransactionsEvent();
}
export async function getTransaction(reference) {
    return await eventPayment.getTransactionEvent(reference);
}
export async function createTransaction(transaction) {
    return await eventPayment.createTransactionEvent(transaction);
}
export async function updateTransaction(transaction) {
    return await eventPayment.updateTransactionEvent(transaction.reference, transaction);
}
