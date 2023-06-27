<template>
  <div class="form-group mt-4 column">
    <label>{{ label }}</label>
    <input
      v-model="inputValue"
      :type="type"
      @input="handleInput"
      :class="{ 'is-invalid': showError }"
      class="mt-2"
    />
    <span v-if="showError" class="error-message">{{ errorMessage }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  validator: {
    type: Function,
    default: null
  },
  value: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  }
})
const emit = defineEmits(['update:modelValue'])

const inputValue = ref(props.value)
const showError = ref(false)
const errorMessage = ref('')

const handleInput = (event) => {
  const newValue = event.target.value
  inputValue.value = newValue

  let isValid = true
  let message = ''

  if (props.validator && typeof props.validator === 'function') {
    ;({ isValid, message } = props.validator(newValue))
    showError.value = !isValid
    errorMessage.value = message
  } else {
    showError.value = false
    errorMessage.value = ''
  }

  const updatedValue = isValid ? inputValue.value : ''
  emit('update:modelValue', updatedValue)
}
</script>

<style scoped>
.form-group {
  box-sizing: border-box;
}

input {
  box-sizing: border-box;
  border: unset;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(60, 66, 87, 0.16),
    0 2px 5px rgba(60, 66, 87, 0.08);
  border-radius: 5px;
  padding: 10px;
}

input.is-invalid {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 0 0 1px red;
  border: unset;
}

.error-message {
  color: red;
  padding: 5px 0;
  font-size: 14px;
}
</style>
