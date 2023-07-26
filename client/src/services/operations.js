import eventPayment from '@/services/eventPayment'

export async function createOperation(transaction_reference, amount) {
  const payload = {
    type: 'refund',
    amount: amount,
    currency: 'EUR',
    transaction_reference: transaction_reference
  }

  return await eventPayment.createOperationEvent(payload)
}
