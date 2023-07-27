<script setup>
import { ref, watch } from 'vue'

const isActive = ref(false)
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  color: {
    type: String,
    validator: (value) => {
      return ['primary', 'secondary'].includes(value)
    },
    default: 'primary',
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
})
const buttonClass = `button-${props.color}`

watch(
  () => props.active,
  (newValue) => {
    isActive.value = newValue
  }
)
</script>

<template>
  <button
    :class="isActive ? buttonClass + ' is-active' : buttonClass + ' is-not-active'"
    type="submit"
  >
    {{ text }}
  </button>
</template>

<style scoped>
button {
  all: unset;
  text-align: center;
  padding: 2% 0;
  border-radius: 5px;
  cursor: pointer;
}

.button-primary {
  background-color: rgb(99, 91, 255);
  color: white;
  transition: all 0.5s ease;
}

.button-secondary {
  background-color: white;
  color: rgb(99, 91, 255);
}

.button-primary.is-not-active {
  background-color: #635bff82;
  cursor: unset;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
