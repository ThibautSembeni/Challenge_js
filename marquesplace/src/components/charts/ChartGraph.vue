<template>
  <div>
    <div
      v-if="loading"
      role="status"
      class="max-w-lg p-4 border border-gray-200 rounded shadow animate-pulse md:p-6"
    >
      <div class="h-2.5 bg-gray-200 rounded-full w-32 mb-2.5"></div>
      <div class="w-48 h-2 mb-10 bg-gray-200 rounded-full"></div>
      <div class="flex items-baseline mt-4 space-x-6">
        <div class="w-full bg-gray-200 rounded-t-lg h-72"></div>
        <div class="w-full h-56 bg-gray-200 rounded-t-lg"></div>
        <div class="w-full bg-gray-200 rounded-t-lg h-72"></div>
        <div class="w-full h-64 bg-gray-200 rounded-t-lg"></div>
        <div class="w-full bg-gray-200 rounded-t-lg h-80"></div>
        <div class="w-full bg-gray-200 rounded-t-lg h-72"></div>
        <div class="w-full bg-gray-200 rounded-t-lg h-80"></div>
      </div>
      <span class="sr-only">Chargement...</span>
    </div>
    <canvas v-else ref="chart" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-moment'

// context of graphics
const chart = ref(null)

// chart consctructor
let currentChart = null

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  width: {
    type: [String, Number],
    default: '400'
  },
  height: {
    type: [String, Number],
    default: '200'
  },
  loading: {
    type: Boolean,
    default: true
  }
})

function createChart() {
  const ctx = chart.value.getContext('2d')
  currentChart = new Chart(ctx, props.config)
}

function updateState() {
  currentChart.update()
}

watch(props.config.data.datasets, () => {
  updateState()
})

onMounted(() => {
  createChart()
})
</script>
