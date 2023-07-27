<script setup>
import {useRoute} from "vue-router";
import {onMounted, reactive, ref} from "vue";
// import { getTransaction} from "@/services/transactions";
import Input from "@/components/form/Input.vue";
import GenericButton from "@/components/GenericButton.vue";
import Form from "@/components/form/Form.vue";
// import {cancelTransaction, createOperation} from "@/services/operations";


const route = useRoute()

const transactionReference = route.params.reference
const transaction = ref(null)


// const submitForm = async (formData) => {
//   const amount = transaction.value.amount
//   const currency = transaction.value.currency
//   console.log("go payment" )
//   const payload = {...formData,amount, currency, transaction_id:transaction.value.id}
//   const response = await createOperation(payload)
// }

const cancel = async () => {
  try {
    // await cancelTransaction(transactionReference)
  } catch (e) {
    console.error(e)
  }

}
const eventHandler = (cardData) =>{
  // console.log("ok", cardData)
}
</script>

<template>
  <div>

    <CreditCard @test="eventHandler"/>


  </div>
</template>
