<template>
  <div class="mb-10">
    <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
    <div class="border-b border-gray-200 w-full"></div>

    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>
