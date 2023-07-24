<script setup>
import {useRoute} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {getTransaction} from "@/services/transactions";
import Input from "@/components/form/Input.vue";
import GenericButton from "@/components/GenericButton.vue";
import Form from "@/components/form/Form.vue";

const route = useRoute()

const transaction = ref(null)
const formData = reactive({
  cardNumber: null,
  cardExpiration: null,
  cardCVC: null
})
onMounted(async () => {
  transaction.value = await getTransaction(route.params.reference)
})
const submitForm = async (formData) => {
  console.log("formData", formData)
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
            <GenericButton :active="formData.cardCVC && formData.cardExpiration && formData.cardNumber" color="primary" text=" Payer"/>
          </template>
        </Form>
      </div>
    </div>
  </div>
</template>
