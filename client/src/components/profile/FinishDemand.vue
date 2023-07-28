<script setup>
import {reactive, ref, watch} from "vue";
import Input from "@/components/form/Input.vue";
import {createDangerToast} from "@/utils/toasts";

const isDisabled = ref(true)
const editMode = ref(false)
const isValidPayload = ref(false)
const emit = defineEmits(['finishEvent'])

const defaultValueMerchant = {
  kbis: '',
  company: '',
  phone_number: '',
  confirmation_url: '',
  cancellation_url: '',
  merchant_url: '',
  payout_currency: 'EUR',
}

const merchantValues = reactive({...defaultValueMerchant})

const handleCancelClick = () => {
  switchMode()
};

const validateCompany = (value) => {
  const isValid = value.length >= 2 && value.length <= 50
  const message = isValid ? '' : 'Le nom de la société doit contenir entre 2 et 50 caractères'
  return {isValid, message}
}
const validateKbis = (value) => {
  const isValid = value.length >= 2 && value.length <= 100
  const message = isValid ? '' : 'Le nom du fichier doit contenir entre 2 et 100 caractères'
  return {isValid, message}
}

const validatePhone = (value) => {
  const isValid = !isNaN(Number(value)) && value.length === 10
  const message = isValid ? '' : 'Le numéro de téléphone doit contenir 10 chiffres'
  return {isValid, message}
}

const completeDemand = async () => {
  switchMode()
}

const switchMode = () => {
  isDisabled.value = !isDisabled.value
  editMode.value = !editMode.value
}

watch(merchantValues, () => {
  isValidPayload.value = merchantValues.kbis.length !== 0 && merchantValues.phone_number.length !== 0 && merchantValues.company.length !== 0 && merchantValues.confirmation_url.length !== 0 && merchantValues.cancellation_url.length !== 0 && merchantValues.merchant_url.length !== 0
})

const validDemand = async () => {
  if (!isValidPayload.value) {
    createDangerToast('Tous les champs sont required, merci de les remplir')
    return
  } else {
    emit('finishEvent', merchantValues)
    Object.assign(merchantValues, defaultValueMerchant)
    switchMode()
  }
}

</script>

<template>
  <div class="flex items-center">
    <h2 class="text-2xl font-bold my-4">Completer votre demande marchand</h2>
    <button
        class="ml-4 px-3 py-2 text-xs font-medium inline-flex text-white bg-blue-700 rounded-lg hover:bg-blue-800"
        @click="completeDemand"
        v-if="editMode === false"
    >
      Completer
    </button>
    <button
        v-if="editMode"
        class="ml-4 px-3 py-2 text-xs font-medium inline-flex rounded-lg hover:bg-green-800 text-white bg-green-700 text-gray-400 bg-gray-300"
        :class="isValidPayload === false ? 'cursor-not-allowed' : ''"
        @click="validDemand"
    >
      Valider demande
    </button>
    <button
        class="ml-4 px-3 py-2 text-xs font-medium inline-flex items-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
        @click="handleCancelClick"
        v-if="editMode"
    >
      <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      Cancel
    </button>


  </div>
  <div class="flex flex-row mb-4">
    <div class="flex-1 mr-2">
      <Input
          label="Merchant URL"
          :value="merchantValues.merchant_url"
          :disabled="isDisabled"
          v-model="merchantValues.merchant_url"
          type="text"
      />

    </div>
  </div>
  <div class="flex flex-row mb-4">

    <div class="w-1/2 pr-2">
      <Input
          label="Kbis"
          type="text"
          :disabled="isDisabled"
          v-model="merchantValues.kbis"
          :validator="validateKbis"
      />
    </div>
    <div class="flex-1 ml-2">
      <Input
          label="Company"
          :value="merchantValues.company"
          :disabled="isDisabled"
          v-model="merchantValues.company"
          :validator="validateCompany"
          type="text"
      />
    </div>
  </div>
  <div class="flex flex-row mb-4">
    <div class="flex-1 mr-2">
      <Input
          label="Confirmation URL"
          :value="merchantValues.confirmation_url"
          :disabled="isDisabled"
          v-model="merchantValues.confirmation_url"
          type="text"
      />

    </div>
    <div class="flex-1 ml-2">
      <Input
          label="Cancellation URL"
          :value="merchantValues.cancellation_url"
          :disabled="isDisabled"
          v-model="merchantValues.cancellation_url"
          type="text"
      />
    </div>
  </div>
  <div class="flex flex-row mb-4">
    <div class="flex-1 mr-2">
      Currency
      <select name="" id="" v-model="merchantValues.payout_currency" :disabled="isDisabled">
        <option value="EUR" selected>EUR</option>
        <option value="USD">USD</option>
      </select>

    </div>
    <div class="flex-1 ml-2">
      <Input
          label="Phone number"
          :value="merchantValues.phone_number"
          :disabled="isDisabled"
          v-model="merchantValues.phone_number"
          type="number"
          :validator="validatePhone"
      />
    </div>
  </div>

</template>

<style scoped>

</style>