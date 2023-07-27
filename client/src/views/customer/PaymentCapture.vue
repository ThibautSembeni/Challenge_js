<script setup>
import {useRoute} from "vue-router";
import {onMounted, reactive, ref} from "vue";
// import { getTransaction} from "@/services/transactions";
import GenericButton from "@/components/GenericButton.vue";
import Form from "@/components/form/Form.vue";
// import {cancelTransaction, createOperation} from "@/services/operations";
import Summary from "@/components/Summary.vue";

const route = useRoute()

const transactionReference = route.params.reference
const transaction = ref(null)

const items = [
  {
    title: "Product 1",
    description: "lorem impsu liwe",
    price: 550,
    img: "https://picsum.photos/id/1005/600/200"
  },
  {
    title: "Product 2",
    description: "lorem impsu liwe",
    price: 250,
    img: "https://picsum.photos/id/1005/600/200"
  },
  {
    title: "Product 3",
    description: "lorem impsu liwe",
    price: 150,
    img: "https://picsum.photos/id/1005/600/200"
  }
]


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
const eventHandler = (cardData) => {
  // console.log("ok", cardData)
}
</script>
<template>
  <div class="flex">

    <div class="flex flex-col justify-center flex-1 mx-auto">
      <Summary :items="items"/>
    </div>
    <form class="flex-1">
      <CreditCard @test="eventHandler"/>
      <input label="" type="hidden" :value="transactionReference" name="transactionReference" />
    </form>

  </div>
</template>
