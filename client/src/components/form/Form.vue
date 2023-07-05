<script setup>
import { ref } from 'vue'
const props = defineProps({
  onSubmit: {
    type: Function,
    required: true
  },
  formData: {
    type: Object,
    required: true
  },
  errorMsg: {
    type: String
  },
  infosMsg: {
    type: String
  }
})

const handleSubmit = () => {
  props.onSubmit(props.formData)
}
</script>

<template>
  <div class="flex flex-col bg-white p-10 lg:p-16" id="form">
    <slot name="title" class=""></slot>
    <form @submit.prevent="handleSubmit" class="form">
      <slot name="inputs" class=""></slot>
      <slot name="links" class=""></slot>
      <slot name="submit" class=""></slot>

      <p v-if="errorMsg" class="mt-2 text-sm text-red-600 text-center">
        {{ errorMsg }}
      </p>
      <p v-if="infosMsg" class="mt-2 text-sm text-green-600 text-center">
        {{ infosMsg }}
      </p>

      <slot name="footer" class=""></slot>
    </form>
  </div>
</template>

<style scoped>
div#form {
  border-radius: 5px;
  box-shadow: 0 7px 14px 0 #3c425714, 0 3px 6px 0 #3c425714;
  box-sizing: border-box;
  height: min-content;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>
