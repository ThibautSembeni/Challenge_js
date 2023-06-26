<script setup>
const { onSubmit, formData } = defineProps({
  onSubmit: {
    type: Function,
    required: true
  },
  formData: {
    type: Object,
    required: true
  }
})
const handleSubmit = () => {
  console.log('form submited')
  onSubmit(formData)
}
</script>

<template>
  <div class="column" id="auth-form">
    <slot name="title" class="mt-2"></slot>
    <form @submit.prevent="handleSubmit" class="column">
      <slot name="inputs" class="mt-2"></slot>
      <slot name="links" class="mt-2"></slot>
      <slot name="submit" class="mt-2"></slot>
    </form>
  </div>
</template>

<style scoped>
#auth-form {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 7px 14px 0 #3c425714, 0 3px 6px 0 #3c425714;
  padding: 10%;
  box-sizing: border-box;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
