<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close'])
const refundAmount = ref(0)

function handleSubmit() {
  emit('close', refundAmount.value)
}
</script>

<template>
  <div
    class="bg-gray-500 bg-opacity-50 fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-8 w-96">
      <h2 class="text-2xl font-bold mb-4">Remboursement</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="refundAmount" class="block text-sm font-medium text-gray-700"
            >Montant à rembourser :</label
          >
          <input
            type="number"
            id="refundAmount"
            v-model="refundAmount"
            step="0.01"
            required
            class="mt-1 p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg"
        >
          Rembourser
        </button>
      </form>
    </div>
  </div>
</template>
