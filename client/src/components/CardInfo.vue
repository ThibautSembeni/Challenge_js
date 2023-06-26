<script setup>
import IconCheck from '@/components/icons/IconCheck.vue'

defineProps({
  subtitle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="row card-container mt-4">
    <div class="icon">
      <IconCheck />
    </div>
    <div class="card-info">
      <div>
        <span class="subtitle-2">
          {{ subtitle }}
        </span>
      </div>
      <div class="mt-2">
        <span class="text-body">
          {{ text }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon {
  fill: #635bff;
  width: fit-content;
}

.card-container {
  margin-left: 1%;
}

.card-info {
  margin-left: 2%;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
