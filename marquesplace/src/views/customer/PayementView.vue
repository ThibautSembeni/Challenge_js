<script setup>
import { useRoute } from 'vue-router'
const reference = useRoute().params.reference
console.log('reference', reference)

function sendData(data) {
  console.log('final data', data)
}
</script>
<template>
  <CreditCard @submit="sendData" :reference="$route.params.reference" />
</template>
