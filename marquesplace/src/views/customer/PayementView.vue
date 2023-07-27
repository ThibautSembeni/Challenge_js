<script setup>
import { useRoute } from 'vue-router'
const reference = useRoute().params.reference



</script>
<template>
  <CreditCard :reference="$route.params.reference" />
</template>
