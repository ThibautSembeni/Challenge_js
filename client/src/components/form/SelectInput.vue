<template>
  <select
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
  >
    <option v-for="(option, index) in options" :value="option.value" :key="index">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup>
defineEmits(['update:modelValue'])
defineProps({
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  }
})
</script>
