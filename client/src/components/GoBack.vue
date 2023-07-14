<template>
  <div>
    <button @click="goBack">{{ text }}</button>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router';

defineProps({
  text: {
    type: String,
    default: "Go Back",
  },
});
const router = useRouter();
const goBack = () => {
  router.go(-1);
};
</script>
