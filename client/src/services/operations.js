import eventPayment from "@/services/eventPayment";

export async function createOperation(transaction_reference, amount) {
    console.log('createOperation', transaction_reference, amount)

    const payload = {
        amount: amount,
        transaction_reference: transaction_reference
    }

    return await eventPayment.createOperationEvent(payload)
}