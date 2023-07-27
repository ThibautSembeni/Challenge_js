<template>
  <div class="w-full md:w-1/2 mb-3">
    <p class="text-sm text-gray-400 mb-1">{{ title }}</p>
    <p class="text-sm font-medium">{{ content }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  content: {
    type: [String, Number],
    required: true
  }
})
</script>
