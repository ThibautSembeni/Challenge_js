import httpClient from '@/services/httpClient';

export default {
    async createTransaction(transaction) {
        const response = await httpClient.post('/eventPayment/transaction', transaction);
        if (response.status !== 201) {
            throw new Error(`Error: ${response.status} - An error occurred when creating the transaction`);
        }
        return response.data;
    },
    async updateTransactionEvent(reference, transaction) {
        const response = await httpClient.put(`/eventPayment/transaction/${reference}`, transaction);
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status} - An error occurred when updating the transaction`);
        }
        return response.data;
    },
    async getTransactionEvent(reference) {
        const response = await httpClient.get(`/eventPayment/transaction/${reference}`);
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status} - An error occurred when getting the transaction`);
        }
        return response.data;
    },
    async getAllTransactionsEvent() {
        const response = await httpClient.get(`/eventPayment/transaction`);
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status} - An error occurred when getting all transactions`);
        }
        return response.data;
    },



    async createOperationEvent(operation) {
        const response = await httpClient.post('/eventPayment/operation', operation);
        if (response.status !== 201) {
            throw new Error(`Error: ${response.status} - An error occurred when creating the operation`);
        }
        return response.data;
    },
    async updateOperationEvent(id, operation) {
        const response = await httpClient.put(`/eventPayment/operation/${id}`, operation);
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status} - An error occurred when updating the operation`);
        }
        return response.data;
    },
    async getOperationEvent(id) {
        const response = await httpClient.get(`/eventPayment/operation/${id}`);
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status} - An error occurred when getting the operation`);
        }
        return response.data;
    },
    async getAllOperationsEvent() {
        const response = await httpClient.get(`/eventPayment/operation`);
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status} - An error occurred when getting all operations`);
        }
        return response.data;
    },
};
