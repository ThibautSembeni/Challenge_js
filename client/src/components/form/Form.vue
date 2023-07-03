<script setup>
const props = defineProps({
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
  props.onSubmit(props.formData)
}
</script>

<template>
  <div class="column" id="form">
    <slot name="title" class=""></slot>
    <form @submit.prevent="handleSubmit" class="form">
      <slot name="inputs" class=""></slot>
      <slot name="links" class=""></slot>
      <slot name="submit" class=""></slot>
    </form>
  </div>
</template>

<style scoped>
div#form {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 7px 14px 0 #3c425714, 0 3px 6px 0 #3c425714;
  padding: 68px;
  box-sizing: border-box;
  width: 50%;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>
