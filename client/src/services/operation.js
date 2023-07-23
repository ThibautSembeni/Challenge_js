import httpClient from '@/services/httpClient'

export async function createRefund(transaction_ref, refunded_amount) {
  const response = await httpClient.post('/operations/refund', {
    transaction_ref,
    refunded_amount
  })
  if (response.status === 201) {
    return response.data
  } else {
    throw new Error(
      `Error: ${response.status} - Une erreur s'est produite lors de la création de la transaction`
    )
  }
}

export async function getTransactionOperationsHistory(transaction_ref) {
  const response = await httpClient.get(`/operations/transaction/${transaction_ref}`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(
      `Error: ${response.status} - Une erreur s'est produite lors de la récupération de l'historique des opérations`
    )
  }
}
