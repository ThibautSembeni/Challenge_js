<script setup>
import {useRoute} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {cancelTransaction, getTransaction} from "@/services/transactions";
import Input from "@/components/form/Input.vue";
import GenericButton from "@/components/GenericButton.vue";
import Form from "@/components/form/Form.vue";
import {createOperation} from "@/services/operations";

const route = useRoute()

const transactionReference = route.params.reference
const transaction = ref(null)
const formData = reactive({
  cardNumber: null,
  cardExpiration: null,
  cardCVC: null
})

onMounted(async () => {
  transaction.value = await getTransaction(transactionReference)
})

const submitForm = async (formData) => {
  const amount = transaction.value.amount
  const currency = transaction.value.currency
  console.log("go payment" )
  const payload = {...formData,amount, currency, transaction_id:transaction.value.id}
  const response = await createOperation(payload)
}

const cancel = async () => {
  try {
    await cancelTransaction(transactionReference)
  } catch (e) {
    console.error(e)
  }

}
</script>

<template>
  <div>
    hello {{ transaction }}


    <div class="flex flex-row">
      <div class="w-1/2">
        Item info
      </div>
      <div class="w-1/2">
        Paiement Info
        <Form :form-data="formData" :on-submit="submitForm">
          <template #inputs>
            <Input v-model="formData.cardNumber" label="Numero de votre carte"/>
            <Input v-model="formData.cardExpiration" label="Date expiration"/>
            <Input v-model="formData.cardCVC" label="CVC" type="number"/>
          </template>
          <template #submit>
            <GenericButton :active="formData.cardCVC && formData.cardExpiration && formData.cardNumber" color="primary"
                           text=" Payer"/>
            <button @click.prevent="cancel">
              Annuler le paiement
            </button>
          </template>
        </Form>

      </div>
    </div>
  </div>
</template>
